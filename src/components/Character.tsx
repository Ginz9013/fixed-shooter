import { useEffect, useRef, useState } from "react";
import { useApplication } from "@pixi/react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";

extend({
  Sprite,
});

// 角色尺寸
export const CHARACTER_SIZE = 60;
export const CHARACTER_Y_POSITION = (screenHeight: number) => screenHeight - 150;

// 角色移動相關
const LEFT_BOUND = 0;
const RIGHT_BOUND = 768 - CHARACTER_SIZE;
const MOVE_SPEED = 5; // 可以調整速度

type CharacterProps = {
  onPositionChange: (x: number) => void; // 新增 onPositionChange callback
};

const Character: React.FC<CharacterProps> = ({ onPositionChange }) => {
  const { app } = useApplication();

  const screenHeight = window.innerHeight;
  const [charX, setCharX] = useState<number>((768 - CHARACTER_SIZE) / 2);

  const moveDir = useRef<0 | -1 | 1>(0); // -1=左, 1=右, 0=不動

  const texture = Assets.get("/assets/レンジャー（レッド）.png");

  // 鍵盤操控事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") moveDir.current = -1;
      if (event.key === "ArrowRight") moveDir.current = 1;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        (event.key === "ArrowLeft" && moveDir.current === -1) ||
        (event.key === "ArrowRight" && moveDir.current === 1)
      ) {
        moveDir.current = 0;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // ticker 動畫
  useEffect(() => {
    const tick = () => {
      if (moveDir.current !== 0) {
        const nextX = Math.max(
          LEFT_BOUND,
          Math.min(RIGHT_BOUND, charX + MOVE_SPEED * moveDir.current)
        );
        setCharX(nextX);
        onPositionChange(nextX); // 回報最新位置
      }
    };
    app.ticker.add(tick);
    return () => {
      app.ticker.remove(tick);
    };
  }, [app, charX, onPositionChange]);

  return (
    <pixiSprite
      texture={texture}
      y={CHARACTER_Y_POSITION(screenHeight)}
      x={charX}
      width={CHARACTER_SIZE}
      height={CHARACTER_SIZE}
    />
  );
};

export default Character;