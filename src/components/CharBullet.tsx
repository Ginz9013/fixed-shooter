import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { CHAR_BULLET_WIDTH, CHAR_BULLET_HEIGHT } from "../config/game";


extend({
  Sprite,
});

type CharBulletProps = {
  x: number;
  y: number;
}

const CharBullet: React.FC<CharBulletProps> = ({ x, y }) => {

  const texture = Assets.get("/assets/びっくりマーク.png");

  return (
    <pixiSprite
      texture={texture}
      width={CHAR_BULLET_WIDTH}
      height={CHAR_BULLET_HEIGHT}
      x={x}
      y={y}
    />
  );
};

export default CharBullet;