
import { useRef, useEffect } from "react";
import type { Sprite } from "pixi.js";


export const useCharacter = () => {

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

  return { charRef, moveDir };
};
