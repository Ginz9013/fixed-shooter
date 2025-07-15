import { extend, useApplication } from "@pixi/react";
import React, { useEffect, useState } from "react";
import { Assets, Sprite } from "pixi.js";

extend({
  Sprite,
});

type BulletProps = {
  x: number;
  y: number;
  vy: number;
  id: number;
  onOutOfBounds: (id: number) => void; // 新增 onOutOfBounds callback
};

const Bullet: React.FC<BulletProps> = ({ x, y: startY, vy, id, onOutOfBounds }) => {
  const { app } = useApplication();
  const [bulletY, setBulletY] = useState(startY);

  const screenHeight = window.innerHeight;

  useEffect(() => {
    const tick = () => {
      const newY = bulletY + vy;
      setBulletY(newY);

      // 檢查是否超出邊界
      if (newY > screenHeight) {
        onOutOfBounds(id);
      }
    };

    app.ticker.add(tick);
    return () => {
      app.ticker.remove(tick);
    };
  }, [app, vy, bulletY, id, onOutOfBounds, screenHeight]);

  const texture = Assets.get("/assets/うんち.png");

  if (!texture) return null;

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={bulletY}
      width={30}
      height={30}
    />
  );
};
export default Bullet;
