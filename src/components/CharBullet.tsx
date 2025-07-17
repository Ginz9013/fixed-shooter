import { extend } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { CHAR_BULLET_WIDTH, CHAR_BULLET_HEIGHT } from "../config/game";
import { useEffect, useRef } from "react";


extend({
  Sprite,
});

type CharBulletProps = {
  id: number;
  x: number;
  y: number;
  onMount: (id: number, bullet: Sprite) => void;
}

const CharBullet: React.FC<CharBulletProps> = ({ id, x, y, onMount }) => {
  // 貼圖
  const texture = Assets.get("/assets/びっくりマーク.png");

  // 子彈實體
  const bulletRef = useRef<Sprite>(null);

  // 初始化綁定 ref 後，把實體加入清單中註冊
  useEffect(() => {
    if (!bulletRef.current) return;

    onMount(id, bulletRef.current);
  }, []);


  return (
    <pixiSprite
      ref={bulletRef}
      texture={texture}
      width={CHAR_BULLET_WIDTH}
      height={CHAR_BULLET_HEIGHT}
      x={x}
      y={y}
    />
  );
};

export default CharBullet;