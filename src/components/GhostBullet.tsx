import React, { useEffect, useRef } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";

extend({
  Sprite,
});

// 只接收位置和 ID，不再自己管理狀態
type BulletProps = {
  id: number;
  x: number;
  y: number;
  onMount: (id: number, bullet: Sprite) => void;
};

const GhostBullet: React.FC<BulletProps> = ({ id, x, y, onMount }) => {
  // 貼圖
  const texture = Assets.get("/assets/うんち.png");
  // 子彈實體
  const bulletRef = useRef<Sprite>(null);


  useEffect(() => {
    if (!bulletRef.current) return;
    
    onMount(id, bulletRef.current);
  }, []);


  if (!texture) return null;

  return (
    <pixiSprite
      ref={bulletRef}
      texture={texture}
      x={x}
      y={y}
      width={30}
      height={30}
    />
  );
};
export default GhostBullet;
