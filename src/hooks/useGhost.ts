import type { Sprite } from "pixi.js";
import { useCallback, useRef, useState } from "react";

const initGhosts = [
  // 第一排
  { id: 0, x: 0, y: 0, defeatedAt: null },
  { id: 1, x: 100, y: 0, defeatedAt: null },
  { id: 2, x: 200, y: 0, defeatedAt: null },
  { id: 3, x: 300, y: 0, defeatedAt: null },
  { id: 4, x: 400, y: 0, defeatedAt: null },
  { id: 5, x: 500, y: 0, defeatedAt: null },
  // 第二排
  { id: 6, x: 50, y: 60, defeatedAt: null },
  { id: 7, x: 150, y: 60, defeatedAt: null },
  { id: 8, x: 250, y: 60, defeatedAt: null },
  { id: 9, x: 350, y: 60, defeatedAt: null },
  { id: 10, x: 450, y: 60, defeatedAt: null },
  // 第三排
  { id: 11, x: 0, y: 120, defeatedAt: null },
  { id: 12, x: 100, y: 120, defeatedAt: null },
  { id: 13, x: 200, y: 120, defeatedAt: null },
  { id: 14, x: 300, y: 120, defeatedAt: null },
  { id: 15, x: 400, y: 120, defeatedAt: null },
  { id: 16, x: 500, y: 120, defeatedAt: null },
  // 第四排
  { id: 17, x: 50, y: 180, defeatedAt: null },
  { id: 18, x: 150, y: 180, defeatedAt: null },
  { id: 19, x: 250, y: 180, defeatedAt: null },
  { id: 20, x: 350, y: 180, defeatedAt: null },
  { id: 21, x: 450, y: 180, defeatedAt: null },
];

export interface GhostData {
  id: number;
  x: number;
  y: number;
  defeatedAt: number | null;
}

export const useGhost = () => {
  // 幽靈資料狀態
  const ghosts = useRef<GhostData[]>(initGhosts);
  // 實體註冊表
  const ghostRefs = useRef<Map<number, Sprite>>(new Map);

  
  const handleGhostMount = useCallback((id: number, ghost: Sprite) => {
    ghostRefs.current.set(id, ghost);
  }, []);

  const handleGhostBatchDefeat = useCallback((ids: Set<number>) => {
    ghosts.current.forEach(ghost => {
      if (ids.has(ghost.id)) {
        const sprite = ghostRefs.current.get(ghost.id);
        
        if (!sprite) return;

        sprite.visible = false;
        ghosts.current[ghost.id].defeatedAt = Date.now();
      }
    });
  }, []);

  const handleGhostBatchRespawn = useCallback((ids: Set<number>) => {
    ghosts.current.forEach(ghost => {
      if (ids.has(ghost.id)) {
        const sprite = ghostRefs.current.get(ghost.id);
        
        if (!sprite) return;

        sprite.visible = true;
        ghosts.current[ghost.id].defeatedAt = null;
      }
    });
  }, []);

  return {
    ghosts,
    ghostRefs,
    handleGhostMount,
    handleGhostBatchDefeat,
    handleGhostBatchRespawn,
  };
}