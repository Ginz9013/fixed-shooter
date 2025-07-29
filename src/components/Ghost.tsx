import { useEffect, useRef } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { GHOST_HEIGHT, GHOST_WIDTH, BOSS_GHOST_HEIGHT, BOSS_GHOST_WIDTH } from "../config/game";
import { type GhostType } from "../hooks/useGhost";

extend({
  Sprite,
});

type GhostProps = {
  id: number;
  type: GhostType;
  x: number;
  y: number;
  onMount: (id: number, ghost: Sprite) => void;
};

const Ghost: React.FC<GhostProps> = ({ id, type, x, y, onMount }) => {
  // 貼圖
  const textureType = type === "normal"
    ? "/assets/マエデーズ15.png"
    : type === "middle"
      ? "/assets/マエデーズ13.png"
      : "/assets/マエデーズ12.png";
  const texture = Assets.get(textureType);

  // Ref 實體
  const ghostRef = useRef<Sprite>(null);

  // 元件初始化綁定時，把元件實體註冊到列表中
  useEffect(() => {
    if (!ghostRef.current) return;
    onMount(id, ghostRef.current);
  }, []);


  if (!texture) return null;

  return (
    <pixiSprite
      ref={ghostRef}
      texture={texture}
      x={x}
      y={y}
      width={type === "boss" ? BOSS_GHOST_WIDTH : GHOST_WIDTH}
      height={type === "boss" ? BOSS_GHOST_HEIGHT : GHOST_HEIGHT}
    />
  );
};

export default Ghost;