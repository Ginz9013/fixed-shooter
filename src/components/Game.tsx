
import { useEffect, useRef, useState, useCallback } from "react";
import { extend, useApplication } from "@pixi/react";
import { Container, Ticker, Text } from "pixi.js";
import Background from "../components/Background";
import Ghost from "../components/Ghost";
import Character, {
  CHARACTER_SIZE,
  CHARACTER_Y_POSITION,
} from "./Character";
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
  Text,
});

const Game = () => {
  const { app } = useApplication();

  const [isGameOver, setIsGameOver] = useState(false);
  const [groupY, setGroupY] = useState(100);
  const groupYRef = useRef(groupY);
  groupYRef.current = groupY;

  const direction = useRef(1);

  const [bullets, setBullets] = useState<BulletData[]>([]);
  const nextBulletId = useRef(0);

  const charXRef = useRef((768 - CHARACTER_SIZE) / 2);

  const groupX = (768 - 550) / 2;

  const handleCharacterPositionChange = useCallback((x: number) => {
    charXRef.current = x;
  }, []);

  const handleGhostShoot = useCallback(
    (x: number, y: number) => {
      if (isGameOver) return; // 遊戲結束後不再射擊

      const newBullet: BulletData = {
        id: nextBulletId.current++,
        x: x + groupX,
        y: y + groupYRef.current,
        vy: 3,
      };
      setBullets((prevBullets) => [...prevBullets, newBullet]);
    },
    [groupX, isGameOver]
  );

  

  useEffect(() => {
    const tick = (ticker: Ticker) => {
      if (isGameOver) {
        app.ticker.remove(tick);
        return;
      }

      const screenHeight = window.innerHeight;

      setBullets((currentBullets) => {
        // 1. 更新所有子彈的位置並過濾出界的
        const movedAndFilteredBullets = currentBullets
          .map((bullet) => ({
            ...bullet,
            y: bullet.y + bullet.vy * ticker.deltaTime,
          }))
          .filter((bullet) => bullet.y < screenHeight);

        // 2. 碰撞偵測
        const charRect = {
          x: charXRef.current,
          y: CHARACTER_Y_POSITION(screenHeight),
          width: CHARACTER_SIZE,
          height: CHARACTER_SIZE,
        };

        let collisionDetected = false;
        for (const bullet of movedAndFilteredBullets) {
          // 使用已經移動過的子彈位置進行碰撞偵測
          const bulletRect = { x: bullet.x, y: bullet.y, width: 12, height: 24 };
          if (
            charRect.x < bulletRect.x + bulletRect.width &&
            charRect.x + charRect.width > bulletRect.x &&
            charRect.y < bulletRect.y + bulletRect.height &&
            charRect.y + charRect.height > bulletRect.y
          ) {
            collisionDetected = true;
            break;
          }
        }

        if (collisionDetected) {
          setIsGameOver(true);
          return []; // 清空所有子彈
        }

        return movedAndFilteredBullets;
      });

      // 更新幽靈群位置
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
  }, [app, isGameOver]); // 移除 'bullets' 依賴，因為 setBullets 使用函數式更新

  return (
    <pixiContainer x={0} y={0}>
      {/* Ghost Group */}
      <pixiContainer x={groupX} y={groupY}>
        {ghostPositionList.map((ghost, index) => (
          <Ghost
            key={index}
            x={ghost.x}
            y={ghost.y}
            onShoot={handleGhostShoot}
          />
        ))}
      </pixiContainer>

      {/* Render all bullets */}
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          x={bullet.x}
          y={bullet.y}
        />
      ))}

      {!isGameOver && (
        <Character onPositionChange={handleCharacterPositionChange} />
      )}

      {isGameOver && (
        <pixiText
          text="Game Over"
          x={768 / 2}
          y={window.innerHeight / 2}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fill: "white",
            fontSize: 64,
            fontWeight: "bold",
          }}
        />
      )}

      {/* Background */}
      <Background />
    </pixiContainer>
  );
};

export default Game;