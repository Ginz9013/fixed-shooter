import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";

extend({
  Sprite,
});

const CharBullet = () => {

  const texture = Assets.get("/assets/びっくりマーク.png");

  return (
    <pixiSprite
      texture={texture}
      width={40}
      height={120}
      x={10}
      y={10}
    />
  );
};

export default CharBullet;