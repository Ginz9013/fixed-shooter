import { useCallback, useRef } from "react";
import { type Ghost } from "./useGhostGroup";
import { checkCollision } from "../utils/game";
import {
  CHARACTER_Y_POSITION,
  CHAR_BULLET_SPEED,
  CHAR_BULLET_HEIGHT,
  CHAR_BULLET_WIDTH,
  GHOST_HEIGHT,
  GHOST_WIDTH,
} from "../config/game";

// 子彈類型
type CharBulletType = "normal" | "bomb";

// 定義子彈的類型
export interface CharBulletData {
  id: number;
  x: number;
  y: number;
  type: CharBulletType;
}

export const useCharBullet = (destroyGhost: (id: number) => void) => {

  const charBullets = useRef<CharBulletData[]>([]);
  const nextBulletId = useRef(0);

  const onCharFire = useCallback((charX: number) => {
    const newBullet: CharBulletData = {
      id: nextBulletId.current++,
      x: charX + 10,
      y: CHARACTER_Y_POSITION - 50,
      type: "normal",
    }
    charBullets.current = [...charBullets.current, newBullet];
  }, []);

  const updateCharBullets = useCallback((deltaTime: number, activeGhosts: Ghost[], groupX: number, groupY: number) => {
    const ghostsToRemove: number[] = [];
    const bulletsToKeep: CharBulletData[] = [];

    charBullets.current.forEach((bullet) => {
      const movedBullet = {
        ...bullet,
        y: bullet.y - CHAR_BULLET_SPEED * deltaTime, // 子彈向上移動
      };

      let hitGhost = false;

      // 檢查是否超出邊界 (y < 0)
      if (movedBullet.y > 0) {
        // 檢查與幽靈的碰撞
        activeGhosts.forEach((ghost) => {
          const ghostAbsoluteX = ghost.x + groupX;
          const ghostAbsoluteY = ghost.y + groupY;

          const bulletRect = {
            x: movedBullet.x,
            y: movedBullet.y,
            width: CHAR_BULLET_WIDTH,
            height: CHAR_BULLET_HEIGHT,
          };

          const ghostRect = {
            x: ghostAbsoluteX,
            y: ghostAbsoluteY,
            width: GHOST_WIDTH,
            height: GHOST_HEIGHT,
          };
          
          const isCollision = checkCollision(bulletRect, ghostRect);
          
          if (isCollision) {
            // 發生碰撞
            hitGhost = true;
            ghostsToRemove.push(ghost.id);
          }
        });

        if (!hitGhost) {
          bulletsToKeep.push(movedBullet);
        }
      }
    });

    // 移除被擊中的幽靈
    ghostsToRemove.forEach((id) => destroyGhost(id));

    // 更新子彈列表
    charBullets.current = bulletsToKeep;
  }, [destroyGhost]);


  return {
    charBullets,
    onCharFire,
    updateCharBullets,
  };
};