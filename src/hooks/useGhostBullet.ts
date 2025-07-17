import { useState, useRef, useCallback } from "react";
import { GHOST_BULLET_SPEED } from "../config/game";
import { checkCollision } from "../utils/game";
import type { Sprite } from "pixi.js";

// 定義子彈的類型
export interface BulletData {
  id: number;
  x: number;
  y: number;
  vy: number; // 垂直速度
}

export const useGhostBullet = () => {
  
  // 幽靈子彈資料狀態
  const [ghostBullets, setGhostBullets] = useState<BulletData[]>([]);
  // 幽靈子彈實體註冊列表
  const ghostBulletRefs = useRef<Map<number, Sprite>>(new Map());
  // 當前子彈序列編號
  const nextBulletId = useRef(0);

  // 把新的子彈實體加入註冊列表
  const handleGhostBulletMount = useCallback((id: number, bullet: Sprite) => {
    ghostBulletRefs.current.set(id, bullet);
  }, []);

  // 批次刪除子彈
  const handleGhostBulletBatchDelete = useCallback((ids: number[]) => {
    setGhostBullets(prev =>
      prev.filter(bullet => !ids.includes(bullet.id))
    );
    ids.forEach(id => ghostBulletRefs.current.delete(id));
  }, []);

  const clearGhostBullets = () => {
    setGhostBullets([]);
    ghostBulletRefs.current.clear();
  };

  // 幽靈開火 - 建立新子彈
  const onGhostFire = useCallback((ghost: Sprite) => {
    const newBullet: BulletData = {
      id: nextBulletId.current++,
      x: ghost.getBounds(true).x + 10,
      y: ghost.getBounds(true).y + 20,
      vy: GHOST_BULLET_SPEED,
    };
    setGhostBullets(prevBullets => [...prevBullets, newBullet]);
  }, []);

  // 更新子彈移動，判斷出界、擊中角色
  const updateGhostBullets = useCallback((
    deltaTime: number,
    character: Sprite,
    takeDamage: () => void
  ) => {
    const bulletsToRemove: number[] = [];
    let hitCharactor = false;

    ghostBulletRefs.current.forEach((bullet, bulletId) => {
      // 更新子彈位置
      bullet.y += GHOST_BULLET_SPEED * deltaTime;

      // 檢查是否超出邊界 (y > screenHeight)
      if (bullet.y > window.innerHeight) {
        bulletsToRemove.push(bulletId);
      } else {

        // 檢查與角色的碰撞
        const isCollision = checkCollision(bullet, character);

        if (isCollision) {
          if (!hitCharactor) {
            takeDamage(); // 一幀中只會造成傷害一次
            hitCharactor = true;
          }
          // 把子彈推到待刪清單中
          bulletsToRemove.push(bulletId);
        }
      }
    });

    // 移除出界或擊中角色的子彈
    handleGhostBulletBatchDelete(bulletsToRemove);
  }, []);

  return {
    ghostBullets,
    ghostBulletRefs,
    handleGhostBulletMount,
    handleGhostBulletBatchDelete,
    clearGhostBullets,
    onGhostFire,
    updateGhostBullets,
  };
};
