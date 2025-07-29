import type { RefObject } from "react";
import type { Sprite } from "pixi.js";
import { BOSS_GHOST_RESPAWN_MS, MIDDLE_GHOST_RESPAWN_MS, NORMAL_GHOST_RESPAWN_MS } from "../config/game";
import type { GhostData } from "../hooks/useGhost";

export const checkCollision = (entityA: Sprite, entityB: Sprite): boolean => {
  const rectA = entityA.getBounds(true).rectangle;
  const rectB = entityB.getBounds(true).rectangle;

  return rectA.intersects(rectB);
}

// 處理怪物重生
export const ghostRespawn = (
  ghostRefs: RefObject<Map<number, Sprite>>,
  ghosts: RefObject<Map<number, GhostData>>,
  handleGhostBatchRespawn: (ids: Set<number>) => void,
) => {
  const now = Date.now();
  const ghostToRespawn: Set<number> = new Set<number>();

  ghostRefs.current.forEach((ghost, id) => {
    const ghostData = ghosts.current.get(id);
    if (!ghostData) return;

    const { type, defeatedAt } = ghostData;

    const timeoutOfType = type === "boss"
      ? BOSS_GHOST_RESPAWN_MS
      : type === "middle"
        ? MIDDLE_GHOST_RESPAWN_MS
        : NORMAL_GHOST_RESPAWN_MS;

    if (!ghost.visible && defeatedAt && now - defeatedAt > timeoutOfType) ghostToRespawn.add(id);
  });

  if (ghostToRespawn.size > 0) {
    handleGhostBatchRespawn(ghostToRespawn);
  }
}