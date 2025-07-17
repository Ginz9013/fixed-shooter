import { useState, useRef, useCallback, type RefObject } from "react";
import { CHARACTER_SIZE, CHARACTER_Y_POSITION, GHOST_BULLET_SPEED } from "../config/game";
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
  const [ghostBullets, setghostBullets] = useState<BulletData[]>([]);
  // 幽靈子彈實體註冊列表
  const ghostBulletRefs = useRef<Map<number, Sprite>>(new Map());
  // 當前子彈序列編號
  const nextBulletId = useRef(0);

  // 把新的子彈實體加入註冊列表
  const handleGhostBulletMount = (id: number, bullet: Sprite) => {
    ghostBulletRefs.current.set(id, bullet);
  }

  // 幽靈開火 - 建立新子彈
  const onGhostFire = useCallback((ghost: Sprite) => {
    const newBullet: BulletData = {
      id: nextBulletId.current++,
      x: ghost.getBounds(true).x + 10,
      y: ghost.getBounds(true).y + 20,
      vy: GHOST_BULLET_SPEED,
    };
    setghostBullets(prevBullets => [...prevBullets, newBullet]);
  }, []);

  // const updateBullets = useCallback(
  //   (deltaTime: number, charX: number) => {
  //     setBullets((currentBullets) => {
  //       const screenHeight = window.innerHeight;
  //       const charRect = {
  //         x: charX,
  //         y: CHARACTER_Y_POSITION,
  //         width: CHARACTER_SIZE,
  //         height: CHARACTER_SIZE,
  //       };

  //       let damageTakenThisFrame = false;

  //       const newBullets = currentBullets.reduce<BulletData[]>((acc, bullet) => {
  //         const movedBullet = {
  //           ...bullet,
  //           y: bullet.y + bullet.vy * deltaTime,
  //         };

  //         // 檢查是否超出邊界
  //         if (movedBullet.y >= screenHeight) {
  //           return acc; // 跳過這顆子彈
  //         }

  //         const bulletRect = {
  //           x: movedBullet.x,
  //           y: movedBullet.y,
  //           width: 12,
  //           height: 24,
  //         };

  //         const isCollision = checkCollision(charRect, bulletRect);
  //         if (isCollision) {
  //           // 發生碰撞
  //           if (!damageTakenThisFrame) {
  //             takeDamage(); // 每幀只扣一次血
  //             damageTakenThisFrame = true;
  //           }
  //           return acc; // 不將這顆子彈加入 newBullets
  //         } else {
  //           acc.push(movedBullet); // 將沒有碰撞的子彈加入新陣列
  //         }
  //         return acc;
  //       }, []);

  //       return newBullets;
  //     });
  //   },
  //   [takeDamage]
  // );

  return {
    ghostBullets,
    handleGhostBulletMount,
    onGhostFire,
  };
};
