import { useRef } from "react";
import type { Container } from "pixi.js";

export const useGhostGroupMovement = () => {
  
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

  return {
    ghostGroupRef,
    bobbing,
  };
}