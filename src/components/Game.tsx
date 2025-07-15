
import { useEffect, useRef, useState, useCallback } from "react";
import { extend, useApplication } from "@pixi/react";
import { Container, Ticker } from "pixi.js";
import Background from "../components/Background";
import Ghost from "../components/Ghost";
import Character from "./Character";
import Bullet from "./Bullet"; // 引入 Bullet 元件

// 定義子彈的類型
interface BulletData {
  id: number;
  x: number;
  y: number;
  vy: number; // 垂直速度
}

const ghostPositionList = [
  // 第一排
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 200, y: 0 },
  { x: 300, y: 0 },
  { x: 400, y: 0 },
  { x: 500, y: 0 },
  // 第二排
  { x: 50, y: 60 },
  { x: 150, y: 60 },
  { x: 250, y: 60 },
  { x: 350, y: 60 },
  { x: 450, y: 60 },
];

extend({
  Container,
});

const Game = () => {
  const { app } = useApplication();

  const [groupY, setGroupY] = useState(100);
  const groupYRef = useRef(groupY);
  groupYRef.current = groupY; // 保持 ref 與 state 同步

  const direction = useRef(1); // 用 ref 存動畫方向

  // 管理所有子彈的狀態
  const [bullets, setBullets] = useState<BulletData[]>([]);
  const nextBulletId = useRef(0);

  // 計算 group 的 X 偏移量
  const groupX = (768 - 550) / 2;

  // 處理幽靈射擊事件
  const handleGhostShoot = useCallback(
    (x: number, y: number) => {
      const newBullet: BulletData = {
        id: nextBulletId.current++,
        // 將 group 的偏移量加回去，轉換為絕對座標
        x: x + groupX,
        y: y + groupYRef.current,
        vy: 5, // 子彈速度
      };
      setBullets((prevBullets) => [...prevBullets, newBullet]);
    },
    [groupX] // groupX 是常數，所以這個 callback 不會一直重新建立
  );

  // 處理子彈超出邊界事件
  const handleBulletOutOfBounds = useCallback((id: number) => {
    setBullets((prevBullets) => prevBullets.filter((bullet) => bullet.id !== id));
  }, []);

  // 幽靈群的持續動畫特效
  useEffect(() => {
    const tick = (ticker: Ticker) => {
      setGroupY((prevY) => {
        let next = prevY + direction.current * ticker.deltaTime * 0.3;
        if (next > 110) direction.current = -1;
        if (next < 100) direction.current = 1;
        return next;
      });
    };

    app.ticker.add(tick);

    return () => {
      app.ticker.remove(tick);
    };
  }, [app]);

  return (
    <pixiContainer x={0} y={0}>
      {/* Ghost Group */}
      <pixiContainer x={(768 - 550) / 2} y={groupY}>
        {ghostPositionList.map((ghost, index) => (
          <Ghost
            key={index}
            x={ghost.x}
            y={ghost.y}
            onShoot={handleGhostShoot} // 傳遞射擊處理函式
          />
        ))}
      </pixiContainer>

      {/* Render all bullets */}
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          x={bullet.x}
          y={bullet.y}
          vy={bullet.vy}
          onOutOfBounds={handleBulletOutOfBounds} // 傳遞邊界處理函式
        />
      ))}

      <Character />

      {/* Background */}
      <Background />
    </pixiContainer>
  );
};

export default Game;