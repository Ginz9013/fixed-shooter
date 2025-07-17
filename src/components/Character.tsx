import { forwardRef } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import {
  CHARACTER_SIZE,
  CHARACTER_Y_POSITION,
  CHARACTER_X_INIT_POSITION,
} from "../config/game";

extend({
  Sprite,
});

const Character = forwardRef<Sprite>((_, ref) => {

  const texture = Assets.get("/assets/レンジャー（レッド）.png");

  return (
    <pixiSprite
      ref={ref}
      texture={texture}
      x={CHARACTER_X_INIT_POSITION}
      y={CHARACTER_Y_POSITION}
      width={CHARACTER_SIZE}
      height={CHARACTER_SIZE}
    />
  );
});

export default Character;
