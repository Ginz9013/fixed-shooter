import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";

extend({
  Sprite
});

type GhostProps = {
  x: number;
  y: number;
}

const Ghost: React.FC<GhostProps> = ({ x, y}) => {

  const texture = Assets.get("/assets/マエデーズ15.png");

  const yell = () => console.log("Ghost~~~~");

  if (!texture) return null;

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={y}
      width={50}
      height={50}
      // 開啟互動
      interactive={true}
      onClick={yell}
      onMouseOver={yell}
    />
  );
};

export default Ghost;