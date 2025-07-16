import { useCallback, useRef } from "react";
import { CHARACTER_Y_POSITION, CHAR_BULLET_SPEED } from "../config/game";

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

  const updateCharBullets = useCallback((deltaTime: number) => {
    charBullets.current = charBullets.current.reduce<CharBulletData[]>((acc, bullet) => {
      const movedBullet = {
        ...bullet,
        y: bullet.y - CHAR_BULLET_SPEED * deltaTime, // 子彈向上移動
      };

      // 檢查是否超出邊界 (y < 0)
      if (movedBullet.y > 0) {
        acc.push(movedBullet);
      }
      return acc;
    }, []);
  }, []);


  return {
    charBullets,
    onCharFire,
    updateCharBullets,
  };
};