import { extend, useApplication } from "@pixi/react";
import React, { useEffect, useRef, useState } from "react";
import { Assets, Sprite } from "pixi.js";


extend({
  Sprite
});

type BulletProps = {
  x: number;
  y: number;
  vy: number;
  id: number;
}
const Bullet: React.FC<BulletProps> = ({ x, y: startY, vy, id }) => {

  const { app } = useApplication();
  
  const [bulletY, setBulletY] = useState(startY);

  useEffect(() => {
    const tick = () => setBulletY(y => y + vy);
    app.ticker.add(tick);
    return () => {
      app.ticker.remove(tick)
    };
  }, [app, vy]);

  const texture = Assets.get("/assets/bullet.png");

  if (!texture) return null;

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={bulletY}
      width={12}
      height={24}
    />
  );
};
export default Bullet;
