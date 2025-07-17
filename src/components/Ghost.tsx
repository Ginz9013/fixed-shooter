import { extend, useApplication } from "@pixi/react";
import { Assets, Sprite } from "pixi.js";
import { useEffect, useRef } from "react";

extend({
  Sprite,
});

// 射擊機率 (每幀)
const SHOOTING_PROBABILITY = 0.001; // 調整這個值來改變射擊頻率

type GhostProps = {
  id: number;
  x: number;
  y: number;
  onMount: (id: number, ghost: Sprite) => void;
  onShoot?: (x: number, y: number) => void; // 新增 onShoot callback
};

const Ghost: React.FC<GhostProps> = ({ id, x, y, onShoot, onMount }) => {
  
  const { app } = useApplication();
  const texture = Assets.get("/assets/マエデーズ15.png");

  // Ref 實體
  const ghostRef = useRef<Sprite>(null);

  // 元件初始化綁定時，把元件實體註冊到列表中
  useEffect(() => {
    if (!ghostRef.current) return;
    onMount(id, ghostRef.current);
  }, []);

  // 射擊邏輯
  // useEffect(() => {
  //   const tick = () => {
  //     if (Math.random() < SHOOTING_PROBABILITY) {
  //       // 子彈初始位置
  //       // 幽靈的中心點位置 + 微調修正
  //       // onShoot(x + 10, y + 50);
  //     }
  //   };
  //   app.ticker.add(tick);
  //   return () => {
  //     app.ticker.remove(tick);
  //   };
  // }, [app, x, y, onShoot]);

  // const yell = () => console.log("Ghost~~~~");

  if (!texture) return null;

  return (
    <pixiSprite
      ref={ghostRef}
      texture={texture}
      x={x}
      y={y}
      width={50}
      height={50}
      // 開啟互動
      // interactive={true}
      // onClick={yell}
      // onMouseOver={yell}
    />
  );
};

export default Ghost;