import type { Sprite } from "pixi.js";
import { useCallback, useRef, useState } from "react";

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
  // 第三排
  { id: 11, x: 0, y: 120 },
  { id: 12, x: 100, y: 120 },
  { id: 13, x: 200, y: 120 },
  { id: 14, x: 300, y: 120 },
  { id: 15, x: 400, y: 120 },
  { id: 16, x: 500, y: 120 },
  // 第四排
  { id: 17, x: 50, y: 180 },
  { id: 18, x: 150, y: 180 },
  { id: 19, x: 250, y: 180 },
  { id: 20, x: 350, y: 180 },
  { id: 21, x: 450, y: 180 },
];

export interface GhostData {
  id: number;
  x: number;
  y: number;
}

export const useGhost = () => {
  // 幽靈資料狀態
  const [ghosts, setGhosts] = useState<GhostData[]>(initGhosts);
  // 實體註冊表
  const ghostRefs = useRef<Map<number, Sprite>>(new Map);


  const handleGhostMount = useCallback((id: number, ghost: Sprite) => {
    ghostRefs.current.set(id, ghost);
  }, []);

  const handleGhostBatchDelete = useCallback((ids: number[]) => {
    setGhosts(prev => prev.filter(ghost => !ids.includes(ghost.id)));
    ids.forEach(id => ghostRefs.current.delete(id));
  }, []);


  return {
    ghosts,
    ghostRefs,
    handleGhostMount,
    handleGhostBatchDelete,
  };
}