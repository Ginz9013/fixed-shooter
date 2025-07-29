import type { Sprite } from "pixi.js";
import { useCallback, useRef } from "react";

export type GhostType = "normal" | "middle" | "boss";

export interface GhostData {
  id: number;
  x: number;
  y: number;
  type: GhostType;
  defeatedAt: number | null;
}

const ghostPositionTemplate: Pick<GhostData, "id" | "x" | "y">[] = [
  // 第一排
  { id: 0, x: 0, y: 0 },
  { id: 1, x: 70, y: 0 },
  { id: 2, x: 140, y: 0 },
  { id: 3, x: 210, y: 0 },
  { id: 4, x: 280, y: 0 },
  { id: 5, x: 350, y: 0 },
  // 第二排
  { id: 6, x: 0, y: 60 },
  { id: 7, x: 70, y: 60 },
  { id: 8, x: 140, y: 60 },
  { id: 9, x: 210, y: 60 },
  { id: 10, x: 280, y: 60 },
  { id: 11, x: 350, y: 60 },
  // 第三排
  { id: 12, x: 0, y: 120 },
  { id: 13, x: 70, y: 120 },
  { id: 14, x: 140, y: 120 },
  { id: 15, x: 210, y: 120 },
  { id: 16, x: 280, y: 120 },
  { id: 17, x: 350, y: 120 },
  // 第四排
  { id: 18, x: 0, y: 180 },
  { id: 19, x: 70, y: 180 },
  { id: 20, x: 140, y: 180 },
  { id: 21, x: 210, y: 180 },
  { id: 22, x: 280, y: 180 },
  { id: 23, x: 350, y: 180 },
  // 第五排
  { id: 24, x: 0, y:240 },
  { id: 25, x: 70, y:240 },
  { id: 26, x: 140, y:240 },
  { id: 27, x: 210, y:240 },
  { id: 28, x: 280, y:240 },
  { id: 29, x: 350, y:240 },
];

const generateGhosts = (ghostPositionTemplate: Pick<GhostData, "id" | "x" | "y">[]): Map<number, GhostData> => {
  // Boss ID 位置
  const bossId = Math.floor(Math.random() * 5);
  // Boss 佔位
  const emptySapce = [bossId + 1, bossId + 6, bossId + 7];

  // 依照機率隨機分布小怪與中怪
  const ghosts = ghostPositionTemplate.map(position => {
    const isNormalGhost = Math.random() < 0.5;

    const ghostData: GhostData = {
      ...position,
      type: isNormalGhost ? "normal" : "middle",
      defeatedAt: null,
    };

    return ghostData;
  });
  
  // 挖空 Boss 的位置
  const bossSpaceList = ghosts.filter(ghost => !emptySapce.includes(ghost.id));
  
  // 修改其中一隻為 Boss
  const initGhosts = bossSpaceList.map(ghost => ghost.id === bossId ? {...ghost, type: "boss" as const} : ghost);

  // 把資料格式從 GhostData[] 轉換為 Map<number, GhostData>
  const ghostMap = new Map<number, GhostData>(
    initGhosts.map(ghost => [ghost.id, ghost])
  )
  return ghostMap;
}

export const useGhost = () => {
  // 幽靈資料狀態
  const ghosts = useRef<Map<number, GhostData>>(generateGhosts(ghostPositionTemplate));
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

        const existGhost = ghosts.current.get(ghost.id);
        if (!existGhost) return;

        ghosts.current.set(ghost.id, {...existGhost, defeatedAt: Date.now()});
      }
    });
  }, []);

  const handleGhostBatchRespawn = useCallback((ids: Set<number>) => {
    ghosts.current.forEach(ghost => {
      if (ids.has(ghost.id)) {
        const sprite = ghostRefs.current.get(ghost.id);
        
        if (!sprite) return;

        sprite.visible = true;

        const existGhost = ghosts.current.get(ghost.id);
        if (!existGhost) return;
        
        ghosts.current.set(ghost.id, {...existGhost, defeatedAt: null});
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