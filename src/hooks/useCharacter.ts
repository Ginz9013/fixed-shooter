
import { useRef, useEffect } from "react";
import { useApplication } from "@pixi/react";
import { LEFT_BOUND, RIGHT_BOUND, MOVE_SPEED } from "../config/game";
import type { Sprite } from "pixi.js";


export const useCharacter = () => {
  const { app } = useApplication();

  // 角色 X 軸位置
  const charRef = useRef<Sprite>(null);

  // 移動方向
  const moveDir = useRef<0 | -1 | 1>(0); // -1=左, 1=右, 0=不動

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

  // Ticker - 更新角色位置
  useEffect(() => {
    const tick = () => {
      if (charRef.current && moveDir.current !== 0) {
        const nextX = Math.max(
          LEFT_BOUND,
          Math.min(RIGHT_BOUND, charRef.current.x + MOVE_SPEED * moveDir.current)
        );
        charRef.current.x = nextX;
      }
    };
    app.ticker.add(tick);
    return () => {
      app.ticker.remove(tick);
    };
  }, [app, charRef]);

  return { charRef };
};
