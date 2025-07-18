import { forwardRef } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import {
  CHARACTER_SIZE,
  CHARACTER_Y_POSITION,
  CHARACTER_X_INIT_POSITION,
} from "../config/game";
import type { CharacterId } from "../config/characters";

extend({
  Sprite,
});

const charTextureMap: Record<CharacterId, string> = {
  red: "/assets/レンジャー（レッド）.png",
  yellow: "/assets/レンジャー（イエロー）.png",
  green: "/assets/レンジャー（グリーン）.png",
  pink: "/assets/レンジャー（ピンク）.png",
  blue: "/assets/レンジャー（ブルー）.png",
  kappa: "/assets/河童（かっぱ）.png",
}

type CharacterProps = {
  charId: CharacterId;
}

const Character = forwardRef<Sprite, CharacterProps>(({ charId }, ref) => {

  const texture = Assets.get(charTextureMap[charId]);

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
