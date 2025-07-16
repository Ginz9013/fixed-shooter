import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { CHARACTER_SIZE, CHARACTER_Y_POSITION } from "../config/game";

extend({
  Sprite,
});


type CharacterProps = {
  x: number;
};

const Character: React.FC<CharacterProps> = ({ x }) => {

  const texture = Assets.get("/assets/レンジャー（レッド）.png");

  return (
    <pixiSprite
      texture={texture}
      y={CHARACTER_Y_POSITION}
      x={x}
      width={CHARACTER_SIZE}
      height={CHARACTER_SIZE}
    />
  );
};

export default Character;
