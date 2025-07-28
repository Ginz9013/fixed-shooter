import { useEffect, useRef } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { GHOST_HEIGHT, GHOST_WIDTH } from "../config/game";

extend({
  Sprite,
});

type GhostProps = {
  id: number;
  x: number;
  y: number;
  onMount: (id: number, ghost: Sprite) => void;
  unMount: (id: number) => void;
};

const Ghost: React.FC<GhostProps> = ({ id, x, y, onMount, unMount }) => {
  // 貼圖
  const texture = Assets.get("/assets/マエデーズ15.png");

  // Ref 實體
  const ghostRef = useRef<Sprite>(null);

  // 元件初始化綁定時，把元件實體註冊到列表中
  useEffect(() => {
    if (!ghostRef.current) return;
    onMount(id, ghostRef.current);

    return () => unMount(id);
  }, []);


  if (!texture) return null;

  return (
    <pixiSprite
      ref={ghostRef}
      texture={texture}
      x={x}
      y={y}
      width={GHOST_WIDTH}
      height={GHOST_HEIGHT}
    />
  );
};

export default Ghost;