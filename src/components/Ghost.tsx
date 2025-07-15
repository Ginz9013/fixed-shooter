import { extend, useApplication } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { useEffect } from "react";

extend({
  Sprite,
});

// 射擊機率 (每幀)
const SHOOTING_PROBABILITY = 0.001; // 調整這個值來改變射擊頻率

type GhostProps = {
  x: number;
  y: number;
  onShoot: (x: number, y: number) => void; // 新增 onShoot callback
};

const Ghost: React.FC<GhostProps> = ({ x, y, onShoot }) => {
  const { app } = useApplication();
  const texture = Assets.get("/assets/マエデーズ15.png");

  // 射擊邏輯
  useEffect(() => {
    const tick = () => {
      if (Math.random() < SHOOTING_PROBABILITY) {
        // 子彈初始位置
        // 幽靈的中心點位置 + 微調修正
        onShoot(x + 10, y + 50);
      }
    };
    app.ticker.add(tick);
    return () => {
      app.ticker.remove(tick);
    };
  }, [app, x, y, onShoot]);

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