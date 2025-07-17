import { useEffect, useMemo } from "react";
import { extend, useApplication } from "@pixi/react";
import { Container, Text, Ticker } from "pixi.js";

import Background from "../components/Background";
import Ghost from "../components/Ghost";
import Character from "./Character";
import CharBullet from "./CharBullet";
import Heart from "./Heart";
import GhostBullet from "./GhostBullet";

import { useGhost } from "../hooks/useGhost";
import { useGhostGroupMovement } from "../hooks/useGhostGroupMovement";
import { useCharacter } from "../hooks/useCharacter";
import { useCharBullet } from "../hooks/useCharBullet";
import { useHearts } from "../hooks/useHearts";
import { useGhostBullet } from "../hooks/useGhostBullet";

import {
  GHOST_GROUP_INIT_X,
  GHOST_GROUP_INIT_Y,
  LEFT_BOUND,
  MOVE_SPEED,
  RIGHT_BOUND,
  SHOOT_INTERVAL_MS,
  SHOOTING_PROBABILITY
} from "../config/game";


extend({
  Container,
  Text,
});

const Game = () => {
  const { app } = useApplication();

  // 血量 & 是否結束遊戲
  const { hearts, takeDamage } = useHearts();

  // 角色
  const { charRef, moveDir } = useCharacter();
  // 角色子彈狀態
  const { charBullets, handleCharBulletMount, clearCharBullets, onCharFire, updateCharBullets } = useCharBullet();

  // 幽靈群
  const { ghosts, ghostRefs, handleGhostMount, handleGhostBatchDelete } = useGhost();
  // 幽靈群組
  const { ghostGroupRef, bobbing } = useGhostGroupMovement();
  // 幽靈子彈狀態
  const { ghostBullets, handleGhostBulletMount, clearGhostBullets, onGhostFire, updateGhostBullets } = useGhostBullet();

  // 遊戲結束
  const isGameOver = useMemo(() => hearts.length <= 0, [hearts]);
  const isGameCompleted = useMemo(() => ghosts.length <= 0, [ghosts]);



  // Game Loop
  useEffect(() => {
    // 角色每隔 2 秒發射子彈
    const timer = setInterval(() => {
      onCharFire(charRef);
    }, SHOOT_INTERVAL_MS);

    const gameLoop = (ticker: Ticker) => {
      if(!ghostGroupRef.current || !charRef.current) return;

      // 更新角色位置
      if (moveDir.current !== 0) {
        const nextX = Math.max(
          LEFT_BOUND,
          Math.min(RIGHT_BOUND, charRef.current.x + MOVE_SPEED * moveDir.current)
        );
        charRef.current.x = nextX;
      };

      // 更新角色子彈
      updateCharBullets(ticker.deltaTime, ghostRefs, handleGhostBatchDelete);

      
      // 控制幽靈群組位置 & 上下漂浮
      
      bobbing(ticker.deltaTime);

      // 幽靈根據機率發射子彈
      ghostRefs.current.forEach((ghost) => {
        if (Math.random() < SHOOTING_PROBABILITY) {
          // 子彈初始位置
          // 幽靈的中心點位置 + 微調修正
          if (isGameOver) return; // 遊戲結束後不再射擊
          onGhostFire(ghost);
        }
      })

      // 更新幽靈子彈位置
      updateGhostBullets(ticker.deltaTime, charRef.current, takeDamage);
      
    };

    app.ticker.add(gameLoop);

    return () => {
      app.ticker.remove(gameLoop);
      clearInterval(timer)
    };
  }, [onCharFire]);

  useEffect(() => {
    clearGhostBullets();
    clearCharBullets();
  }, [isGameOver, isGameCompleted]);


  return (
    <pixiContainer x={0} y={0}>
      {/* 愛心 */}
      <pixiContainer x={30} y={20}>
        {hearts.map((heart) => (
          <Heart key={heart.x} x={heart.x} type={heart.type} />
        ))}
      </pixiContainer>

      {/* 幽靈 */}
      <pixiContainer
        ref={ghostGroupRef}
        x={GHOST_GROUP_INIT_X}
        y={GHOST_GROUP_INIT_Y}
      >
        {ghosts.map(ghost => (
          <Ghost
            key={ghost.id}
            id={ghost.id}
            x={ghost.x}
            y={ghost.y}
            onMount={handleGhostMount}
          />
        ))}
      </pixiContainer>

      {/* 幽靈子彈 */}
      {!isGameCompleted && !isGameOver && ghostBullets.map((bullet) => (
        <GhostBullet
          key={bullet.id}
          id={bullet.id}
          x={bullet.x}
          y={bullet.y}
          onMount={handleGhostBulletMount}
        />
      ))}

      {!isGameOver && <Character ref={charRef} />}

      {/* 角色子彈 */}
      {!isGameCompleted && !isGameOver && charBullets.map((bullet) => (
        <CharBullet
          id={bullet.id}
          key={bullet.id}
          x={bullet.x}
          y={bullet.y}
          onMount={handleCharBulletMount}
        />
      ))}

      {(isGameCompleted || isGameOver) && (
        <pixiText
          text={ isGameCompleted ? "You Win" : "Game Over"}
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