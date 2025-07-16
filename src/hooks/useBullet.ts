import { useState, useRef, useCallback } from "react";
import { Ticker } from "pixi.js";
import { CHARACTER_SIZE, CHARACTER_Y_POSITION } from "../config/game";

// 定義子彈的類型
export interface BulletData {
  id: number;
  x: number;
  y: number;
  vy: number; // 垂直速度
}

export const useBullet = (takeDamage: () => void) => {
  const [bullets, setBullets] = useState<BulletData[]>([]);
  const nextBulletId = useRef(0);

  const createBullet = useCallback((x: number, y: number, vy: number) => {
    const newBullet: BulletData = {
      id: nextBulletId.current++,
      x,
      y,
      vy,
    };
    setBullets((prevBullets) => [...prevBullets, newBullet]);
  }, []);

  const updateBullets = useCallback(
    (ticker: Ticker, charX: number) => {
      setBullets((currentBullets) => {
        const screenHeight = window.innerHeight;
        const charRect = {
          x: charX,
          y: CHARACTER_Y_POSITION,
          width: CHARACTER_SIZE,
          height: CHARACTER_SIZE,
        };

        let damageTakenThisFrame = false;

        const newBullets = currentBullets.reduce<BulletData[]>((acc, bullet) => {
          const movedBullet = {
            ...bullet,
            y: bullet.y + bullet.vy * ticker.deltaTime,
          };

          // 檢查是否超出邊界
          if (movedBullet.y >= screenHeight) {
            return acc; // 跳過這顆子彈
          }

          const bulletRect = {
            x: movedBullet.x,
            y: movedBullet.y,
            width: 12,
            height: 24,
          };
          if (
            charRect.x < bulletRect.x + bulletRect.width &&
            charRect.x + charRect.width > bulletRect.x &&
            charRect.y < bulletRect.y + bulletRect.height &&
            charRect.y + charRect.height > bulletRect.y
          ) {
            // 發生碰撞
            if (!damageTakenThisFrame) {
              takeDamage(); // 每幀只扣一次血
              damageTakenThisFrame = true;
            }
            return acc; // 不將這顆子彈加入 newBullets
          } else {
            acc.push(movedBullet); // 將沒有碰撞的子彈加入新陣列
          }
          return acc;
        }, []);

        return newBullets;
      });
    },
    [takeDamage]
  );

  return {
    bullets,
    createBullet,
    updateBullets,
  };
};
