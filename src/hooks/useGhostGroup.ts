import { useCallback, useRef } from "react";

const initGhosts = [
  // 第一排
  { id: 0, x: 0, y: 0 },
  { id: 1, x: 100, y: 0 },
  { id: 2, x: 200, y: 0 },
  { id: 3, x: 300, y: 0 },
  { id: 4, x: 400, y: 0 },
  { id: 5, x: 500, y: 0 },
  // 第二排
  { id: 6, x: 50, y: 60 },
  { id: 7, x: 150, y: 60 },
  { id: 8, x: 250, y: 60 },
  { id: 9, x: 350, y: 60 },
  { id: 10, x: 450, y: 60 },
];

export interface Ghost {
  id: number;
  x: number;
  y: number;
}

export const useGhostGroup = () => {

  // 是否通關遊戲
  const isGameCompleted = useRef<boolean>(false);

  // 幽靈狀態
  const ghosts = useRef<Ghost[]>(initGhosts);
  
  // 幽靈群 x 軸位置
  const groupX = (768 - 550) / 2;
  // 幽靈群 y 軸位置
  const groupY = useRef<number>(100);
  // 幽靈群移動方向
  const direction = useRef(1);

  const destroyGhost = useCallback((id: number) => {
    ghosts.current = ghosts.current.filter(ghost => ghost.id !== id);
    // 更新是否通關遊戲的狀態
    isGameCompleted.current = ghosts.current.length <= 0;
  }, []);

  // 角色持續晃動
  const bobbing = (deltaTime: number) => {
    let next = groupY.current + direction.current * deltaTime * 0.3;
    if (next > 110) direction.current = -1;
    if (next < 100) direction.current = 1;
    groupY.current = next;
  }

  return {
    ghosts,
    groupX,
    groupY,
    destroyGhost,
    bobbing,
    isGameCompleted: isGameCompleted.current,
  };
};