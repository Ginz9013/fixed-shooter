
import { useState, useRef, useEffect } from "react";
import { useApplication } from "@pixi/react";
import {
  CHARACTER_SIZE,
  LEFT_BOUND,
  RIGHT_BOUND,
  MOVE_SPEED
} from "../config/game";


export const useCharacter = () => {
  const { app } = useApplication();

  // 角色 X 軸位置 (State)
  const [charX, setCharX] = useState<number>((768 - CHARACTER_SIZE) / 2);
  
  // 角色 X 軸位置 (Ref) - 用於給其他 ticker 取得最新位置，避免 re-render
  const charXRef = useRef(charX);
  useEffect(() => {
    charXRef.current = charX;
  }, [charX]);

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
      if (moveDir.current !== 0) {
        const nextX = Math.max(
          LEFT_BOUND,
          Math.min(RIGHT_BOUND, charX + MOVE_SPEED * moveDir.current)
        );
        setCharX(nextX);
      }
    };
    app.ticker.add(tick);
    return () => {
      app.ticker.remove(tick);
    };
  }, [app, charX]);

  return { charX, charXRef, CHARACTER_SIZE };
};
