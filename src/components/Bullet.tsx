import { extend } from "@pixi/react";
import React from "react";
import { Assets, Sprite } from "pixi.js";

extend({
  Sprite,
});

// 只接收位置和 ID，不再自己管理狀態
type BulletProps = {
  x: number;
  y: number;
};

const Bullet: React.FC<BulletProps> = ({ x, y }) => {
  const texture = Assets.get("/assets/うんち.png");

  if (!texture) return null;

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={y}
      width={30}
      height={30}
    />
  );
};
export default Bullet;
