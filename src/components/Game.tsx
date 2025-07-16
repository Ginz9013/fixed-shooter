
import { useEffect, useCallback } from "react";
import { extend, useApplication } from "@pixi/react";
import { Container, Ticker, Text } from "pixi.js";
import Background from "../components/Background";
import Ghost from "../components/Ghost";
import Character from "./Character";
import GhostBullet from "./GhostBullet";
import Heart from "./Heart";
import CharBullet from "./CharBullet";
import { useHearts } from "../hooks/useHearts";
import { useGhostGroup } from "../hooks/useGhostGroup";
import { useGhostBullet } from "../hooks/useGhostBullet";
import { useCharacter } from "../hooks/useCharacter";

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

  // 血量 & 是否結束遊戲
  const { hearts, takeDamage, isGameOver } = useHearts();

  // 子彈狀態
  const { bullets, createBullet, updateBullets } = useGhostBullet(takeDamage);

  // 幽靈群
  const { groupX, groupY, groupYRef, bobbing } = useGhostGroup();

  // 角色狀態
  const { charX, charXRef } = useCharacter();

  // 控制射擊的方法
  const handleGhostShoot = useCallback(
    (x: number, y: number) => {
      if (isGameOver) return; // 遊戲結束後不再射擊

      createBullet(x + groupX, y + groupYRef.current, 3);
    },
    [groupX, isGameOver, createBullet, groupYRef]
  );

  useEffect(() => {
    const tick = (ticker: Ticker) => {
      if (isGameOver) {
        app.ticker.remove(tick);
        return;
      }

      updateBullets(ticker, charXRef.current);

      // 持續上下晃動幽靈群
      bobbing(ticker.deltaTime);
    };

    app.ticker.add(tick);

    return () => {
      app.ticker.remove(tick);
    };
  }, [app, isGameOver, updateBullets, bobbing]);

  return (
    <pixiContainer x={0} y={0}>
      {/* Hearts */}
      <pixiContainer x={30} y={20}>
        {hearts.map((heart) => (
          <Heart key={heart.x} x={heart.x} type={heart.type} />
        ))}
      </pixiContainer>

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
        <GhostBullet
          key={bullet.id}
          x={bullet.x}
          y={bullet.y}
        />
      ))}

      {!isGameOver && (
        <Character x={charX} />
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