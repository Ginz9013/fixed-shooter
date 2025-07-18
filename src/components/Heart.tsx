import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { type HeartData } from "../hooks/useHearts";

extend({
  Sprite,
});

const Heart: React.FC<HeartData> = ({ x, type }) => {

  const texture = Assets.get(type === "heart"
    ? "/assets/赤色のハート.png"
    : "/assets/黄色のハート.png"
  );

  return (
    <pixiSprite
      texture={texture}
      width={50}
      height={50}
      x={x}
      y={0}
    />
  );
};

export default Heart;