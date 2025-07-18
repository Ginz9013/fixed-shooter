import { useCallback, useRef, useState, type RefObject } from "react";
import { checkCollision } from "../utils/game";
import { CHARACTER_Y_POSITION, CHAR_BULLET_SPEED } from "../config/game";
import type { Sprite } from "pixi.js";
import type { CharacterSpec } from "../config/characters";

// 子彈類型
type CharBulletType = "normal" | "bomb";

// 定義子彈的類型
export interface CharBulletData {
  id: number;
  x: number;
  y: number;
  type: CharBulletType;
}

export const useCharBullet = () => {

  // 角色子彈資料
  const [charBullets, setCharBullets] = useState<CharBulletData[]>([]);
  // 角色子彈實體註冊列表
  const charBulletRefs = useRef<Map<number, Sprite>>(new Map());
  // 當前子彈序列編號
  const nextBulletId = useRef(0);


  // 把新的子彈實體加入註冊列表
  const handleCharBulletMount = useCallback((id: number, bullet: Sprite) => {
    charBulletRefs.current.set(id, bullet);
  }, []);

  // 批次刪除子彈
  const handleCharBulletBatchDelete = useCallback((ids: number[]) => {
    setCharBullets(prev =>
      prev.filter(bullet => !ids.includes(bullet.id))
    );

    ids.forEach(id => charBulletRefs.current.delete(id));
  }, []);

  // 重置 - 清空子彈
  const clearCharBullets = useCallback(() => {
    setCharBullets([]);
    charBulletRefs.current.clear();
  }, []);

  // 角色開火 - 建立新子彈 (使用遞迴 setTimeout 解決閉包問題)
  const onCharFire = useCallback((charRef: RefObject<Sprite | null>, burstFire: CharacterSpec['burstFire']) => {
    const { count, delayMs } = burstFire;

    // 定義一個遞迴函式來處理連射
    const fireRecursive = (shotsLeft: number) => {
      // 基本情況：如果沒有子彈要發射了，就停止
      if (shotsLeft <= 0 || !charRef.current) {
        return;
      }

      // --- 發射一枚子彈 ---
      // 在這裡，我們讀取的是「現在」的角色位置
      const newBullet: CharBulletData = {
        id: nextBulletId.current++,
        x: charRef.current.x + 10,
        y: CHARACTER_Y_POSITION - 50,
        type: "normal",
      };
      setCharBullets(prev => [...prev, newBullet]);
      // --------------------

      // 如果還有子彈需要連射，則設定下一次的發射
      if (shotsLeft > 1) {
        setTimeout(() => {
          fireRecursive(shotsLeft - 1);
        }, delayMs);
      }
    };

    // 啟動連射
    fireRecursive(count);

  }, [setCharBullets]);

  // 更新子彈移動，判斷出界、擊中幽靈
  const updateCharBullets = useCallback((
    deltaTime: number,
    ghostRefs: RefObject<Map<number, Sprite>>,
    handleGhostBatchDelete: (ids: number[]) => void,
    addScore: (score: number) => void,
  ) => {
    const ghostsToRemove: number[] = [];
    const bulletsToRemove: number[] = [];

    charBulletRefs.current.forEach((bullet, bulletId) => {
      const bulletBounds = bullet.getBounds(true);
      if (bulletBounds.width > 50) { // 假設子彈寬度不可能超過 50
        // 如果邊界框異常巨大，則跳過這一幀的處理
        // 在下一幀，它很可能已經被正確渲染了
        return;
      }

      let hitGhost = false;

      // 更新子彈位置
      bullet.y -= CHAR_BULLET_SPEED * deltaTime;

      // 檢查是否超出邊界 (y < 0)
      if (bullet.y < 0) {
        bulletsToRemove.push(bulletId);
      } else {

        // 檢查與幽靈的碰撞
        ghostRefs.current.forEach((ghost, ghostId) => {
          const isCollision = checkCollision(bullet, ghost);

          // 發生碰撞
          if (isCollision) {
            hitGhost = true;
            // 把幽靈推到待刪清單中
            ghostsToRemove.push(ghostId);
          }
        });

        // 也把子彈推到待刪清單中
        if (hitGhost) bulletsToRemove.push(bulletId);
      };
    });

    // 移除被擊中的幽靈
    handleGhostBatchDelete(ghostsToRemove);

    // 根據移除的幽靈加分
    addScore(ghostsToRemove.length);

    // 移除出界或擊中幽靈的子彈
    handleCharBulletBatchDelete(bulletsToRemove);
  }, []);


  return {
    charBullets,
    charBulletRefs,
    handleCharBulletMount,
    clearCharBullets,
    onCharFire,
    updateCharBullets,
  };
};