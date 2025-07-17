import { forwardRef, useEffect } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import {
  CHARACTER_SIZE,
  CHARACTER_Y_POSITION,
  CHARACTER_X_INIT_POSITION,
  SHOOT_INTERVAL_MS
} from "../config/game";

extend({
  Sprite,
});

type CharacterProps = {
  onFire: () => void;
}

const Character = forwardRef<Sprite, React.PropsWithoutRef<CharacterProps>>(({ onFire }, ref) => {

  const texture = Assets.get("/assets/レンジャー（レッド）.png");

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("発射！！！")
      onFire();
    }, SHOOT_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [onFire]);

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
