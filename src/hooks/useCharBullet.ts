import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { checkCollision } from "../utils/game";
import { CHARACTER_Y_POSITION, CHAR_BULLET_SPEED } from "../config/game";
import type { Sprite, Ticker } from "pixi.js";
import { useApplication } from "@pixi/react";

// 子彈類型
type CharBulletType = "normal" | "bomb";

// 定義子彈的類型
export interface CharBulletData {
  id: number;
  x: number;
  y: number;
  type: CharBulletType;
}

type UseCharBulletProps = {
  charRef: RefObject<Sprite | null>;
  ghostRefs: RefObject<Map<number, Sprite>>;
  handleGhostBatchDelete: (ids: number[]) => void;
}

export const useCharBullet = ({ charRef, ghostRefs, handleGhostBatchDelete }: UseCharBulletProps) => {
  const { app } = useApplication();

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

  // 角色開火 - 建立新子彈
  const onCharFire = useCallback(() => {
    if (!charRef.current) return;

    const newBullet: CharBulletData = {
      id: nextBulletId.current++,
      x: charRef.current.x + 10,
      y: CHARACTER_Y_POSITION - 50,
      type: "normal",
    };
    setCharBullets(prev => [...prev, newBullet]);
  }, []);

  // 更新子彈移動，判斷出界、擊中幽靈
  const updateCharBullets = useCallback((deltaTime: number) => {
    const ghostsToRemove: number[] = [];
    const bulletsToRemove: number[] = [];

    charBulletRefs.current.forEach((bullet, bulletId) => {
      // const bulletBounds = bullet.getBounds(true);
      // if (bulletBounds.width > 50) { // 假設子彈寬度不可能超過 50
      //   // 如果邊界框異常巨大，則跳過這一幀的處理
      //   // 在下一幀，它很可能已經被正確渲染了
      //   return;
      // }

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
            // 【偵錯點 2】如果發生碰撞，印出雙方的邊界資訊
            console.log(`Collision Detected! Bullet ID: ${bulletId}, Ghost ID: ${ghostId}`);
            console.log('Bullet:');
            console.log(bullet);
            console.log('Ghost Bounds:', ghost.getBounds(true));


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

    // 移除出界或擊中幽靈的子彈
    handleCharBulletBatchDelete(bulletsToRemove);
  }, []);

  useEffect(() => {
    const tick = (ticker: Ticker) => {
      updateCharBullets(ticker.deltaTime);
    };

    app.ticker.add(tick);

    return () => {
      app.ticker.remove(tick);
    }
  }, []);

  return {
    charBullets,
    charBulletRefs,
    handleCharBulletMount,
    onCharFire,
    updateCharBullets,
  };
};