import type { Sprite } from "pixi.js";

export const checkCollision = (entityA: Sprite, entityB: Sprite): boolean => {
  const rectA = entityA.getBounds(true).rectangle;
  const rectB = entityB.getBounds(true).rectangle;

  return rectA.intersects(rectB);
}