import { useEffect, useRef } from "react";
import type { Container, Ticker } from "pixi.js";
import { useApplication } from "@pixi/react";

export const useGhostGroupMovement = () => {
  const { app } = useApplication();
  
  // 幽靈群組的 Ref
  const ghostGroupRef = useRef<Container>(null);
  // 幽靈群組移動方向
  const direction = useRef(1);


  const bobbing = (deltaTime: number) => {
    if(!ghostGroupRef.current) return;

    const next = ghostGroupRef.current.y + direction.current * deltaTime * 0.3;
    if (next > 110) direction.current = -1;
    if (next < 100) direction.current = 1;
    ghostGroupRef.current.y = next;
  };

  // 控制幽靈群組位置 & 上下漂浮
  useEffect(() => {
    if(!ghostGroupRef.current) return;

    const tick = (ticker: Ticker) => bobbing(ticker.deltaTime);
    app.ticker.add(tick);

    return () => {
      app.ticker.remove(tick);
    }

  }, [ghostGroupRef.current]);

  return {
    ghostGroupRef,
    bobbing,
  };
}