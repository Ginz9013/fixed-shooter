import { extend } from "@pixi/react";
import { Sprite } from "pixi.js";
import { Assets } from "pixi.js";
import { ColorMatrixFilter } from "pixi.js";

extend({
  Sprite,
});

// 先建立濾鏡
const darken = new ColorMatrixFilter();
darken.brightness(0.5, false); // 0.5 代表暗一半

const Background = () => {

  const bgTexture = Assets.get("/assets/background.png");
  const screenHeight = window.innerHeight;


  if (!bgTexture) return null;

  return (
    <pixiSprite
      x={0}
      y={0}
      width={768}
      height={screenHeight}
      texture={bgTexture}
      zIndex={-1}
      filters={[darken]}
    />
  );
};

export default Background;