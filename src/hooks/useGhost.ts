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

  const handleGhostKilled = useCallback((id: number) => {
    ghostRefs.current.delete(id);
    setGhosts(prev => prev.filter(ghost => ghost.id !== id));
  }, []);

  // 目前用不到
  const spawnGhost = useCallback((x: number, y: number) => {
    const newGhost: GhostData = {
      id: Date.now(),
      x,
      y,
    };
    setGhosts(prev => [...prev, newGhost]);
  }, []);

  return {
    ghosts,
    ghostRefs,
    handleGhostMount,
    handleGhostKilled,
    spawnGhost,
  };
}