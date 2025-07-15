import { useState, useRef } from "react";

export const useGhostGroup = () => {
  // 幽靈群 y 軸位置
    const [groupY, setGroupY] = useState(100);
    const groupYRef = useRef(groupY);
    groupYRef.current = groupY;
    // 幽靈群移動方向
    const direction = useRef(1);
    // 幽靈群 x 軸位置
    const groupX = (768 - 550) / 2;

    // 角色持續晃動
    const bobbing = (deltaTime: number) =>setGroupY((prevY) => {
      let next = prevY + direction.current * deltaTime * 0.3;
      if (next > 110) direction.current = -1;
      if (next < 100) direction.current = 1;
      return next;
    });

    return {
      groupX,
      groupY,
      groupYRef,
      bobbing,
    }
};