import { useCallback, useRef, useState, type RefObject } from "react";
import { checkCollision } from "../utils/game";
import { CHARACTER_Y_POSITION, CHAR_BIG_BOMB_SCOPE, CHAR_BOMB_SPEED, CHAR_SMALL_BOMB_SCOPE } from "../config/game";
import type { Sprite } from "pixi.js";
import type { SpecialAbility } from "../config/characters";

// 定義炸彈類型
export interface CharBombData {
  id: number;
  x: number;
  y: number;
  type: SpecialAbility["type"];
}

export const useCharBomb = () => {

  // 角色炸彈資料
  const [charBombs, setCharBombs] = useState<CharBombData[]>([]);
  // 角色炸彈實體註冊列表
  const charBombRefs = useRef<Map<number, Sprite>>(new Map());
  // 當前子彈序列編號
  const nextBombId = useRef(0);


  // 把新的炸彈實體加入註冊列表
  const handleCharBombMount = useCallback((id: number, bomb: Sprite) => {
    charBombRefs.current.set(id, bomb);
  }, []);

  // 批次刪除炸彈
  const handleCharBombBatchDelete = useCallback((ids: number[]) => {
    setCharBombs(prev =>
      prev.filter(bomb => !ids.includes(bomb.id))
    );
    ids.forEach(id => charBombRefs.current.delete(id));
  }, []);

  // 重置 - 清空炸彈
  const clearCharBombs = useCallback(() => {
    setCharBombs([]);
    charBombRefs.current.clear();
  }, []);

  // 角色發射炸彈 (一次只能一顆)
  const onCharFireBomb = useCallback((charRef: RefObject<Sprite | null>, type: SpecialAbility["type"]) => {
    // 如果畫面上已經有炸彈，則不執行
    if (!charRef.current) return;

    const newBomb: CharBombData = {
      id: nextBombId.current++,
      x: charRef.current.x + 5,
      y: CHARACTER_Y_POSITION - 50,
      type,
    };
    setCharBombs(prev => [...prev, newBomb]);

  }, [charBombs.length]);

  // 更新炸彈移動，判斷出界、擊中幽靈引爆
  const updateCharBombs = useCallback((
    deltaTime: number,
    bombType: SpecialAbility["type"],
    ghostRefs: RefObject<Map<number, Sprite>>,
    handleGhostBatchDelete: (ids: Set<number>) => void,
    addScore: (score: number) => void,
  ) => {
    const bombsToRemove: number[] = [];
    let explosionCenter: { x: number; y: number } | null = null;

    charBombRefs.current.forEach((bomb, bombId) => {
      if (explosionCenter) return; // 本幀已觸發爆炸，不再處理其他炸彈

      const bombBounds = bomb.getBounds(true);
      if (bombBounds.width > 100) { // 假設詐彈寬度不可能超過 100
        return;
      }

      // 更新炸彈位置
      bomb.y -= CHAR_BOMB_SPEED * deltaTime;

      // 檢查是否超出邊界
      if (bomb.y < 0) {
        bombsToRemove.push(bombId);
        return;
      }

      // 檢查與幽靈的碰撞
      ghostRefs.current.forEach((ghost) => {
        if (checkCollision(bomb, ghost)) {
          explosionCenter = { x: bomb.x, y: bomb.y };
          bombsToRemove.push(bombId); // 準備移除這顆引爆的炸彈
        }
      });
    });

    // 如果發生爆炸，則清除爆炸範圍內的幽靈
    if (explosionCenter) {
      const ghostsToDestroy: Set<number> = new Set<number>();
      const explosionRadius = bombType === "BIG_BOMB" ? CHAR_BIG_BOMB_SCOPE : CHAR_SMALL_BOMB_SCOPE; // 爆炸半徑
      const radiusSquared = explosionRadius * explosionRadius; // 使用半徑的平方來比較，避免開根號，效能較好

      ghostRefs.current.forEach((ghost, ghostId) => {
        // 取得幽靈的全域邊界來計算其中心點
        const ghostRect = ghost.getBounds(true).rectangle;
        const ghostCenterX = ghostRect.x + ghostRect.width / 2;
        const ghostCenterY = ghostRect.y + ghostRect.height / 2;

        const dx = ghostCenterX - explosionCenter!.x;
        const dy = ghostCenterY - explosionCenter!.y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < radiusSquared) {
          ghostsToDestroy.add(ghostId);
        }
      });

      if (ghostsToDestroy.size > 0) {
        handleGhostBatchDelete(ghostsToDestroy);
        // 加分 (例如每個幽靈 2 分)
        addScore(ghostsToDestroy.size);
      }
    }

    // 移除出界或已引爆的炸彈
    if (bombsToRemove.length > 0) {
      handleCharBombBatchDelete(bombsToRemove);
    }

  }, [handleCharBombBatchDelete]);


  return {
    charBombs,
    handleCharBombMount,
    clearCharBombs,
    onCharFireBomb,
    updateCharBombs,
  };
};