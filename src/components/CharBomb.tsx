import { useEffect, useRef } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import type React from "react";
import type { SpecialAbility } from "../config/characters";
import { CHAR_BOMB_WIDTH, CHAR_BOMB_HEIGHT } from "../config/game";

extend({
  Sprite,
});

type BombProps = {
  id: number;
  x: number;
  y: number;
  type: SpecialAbility["type"];
  onMount: (id: number, bullet: Sprite) => void;
}

const CharBomb: React.FC<BombProps> = ({ id, x, y, type, onMount }) => {
  // 貼圖
  const texture = Assets.get( type === "BIG_BOMB" ? "/assets/バナナの皮.png" : "/assets/きゅうり.png");
  // 炸彈實體
  const bombRef = useRef<Sprite>(null);

  useEffect(() => {
    if (!bombRef.current) return;

    onMount(id, bombRef.current);
  }, []);

  return (
    <pixiSprite
      ref={bombRef}
      texture={texture}
      width={ type === "BIG_BOMB" ? CHAR_BOMB_WIDTH : CHAR_BOMB_WIDTH - 30}
      height={CHAR_BOMB_HEIGHT}
      x={x}
      y={y}
    />
  );
};

export default CharBomb;