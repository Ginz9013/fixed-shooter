
import { extend, useApplication } from "@pixi/react";
import { Container, Text, Ticker } from "pixi.js";
import Background from "../components/Background";
import { useGhost } from "../hooks/useGhost";
import { useGhostGroupMovement } from "../hooks/useGhostGroupMovement";
import { useCharacter } from "../hooks/useCharacter";
import { useCharBullet } from "../hooks/useCharBullet";


import Ghost from "../components/Ghost";
import Character from "./Character";
import CharBullet from "./CharBullet";
import { GHOST_GROUP_INIT_X, GHOST_GROUP_INIT_Y, LEFT_BOUND, MOVE_SPEED, RIGHT_BOUND, SHOOT_INTERVAL_MS } from "../config/game";
import { useEffect } from "react";
// import GhostBullet from "./GhostBullet";
// import Heart from "./Heart";
// import { useHearts } from "../hooks/useHearts";
// import { useGhostBullet } from "../hooks/useGhostBullet";
// import { useCharacter } from "../hooks/useCharacter";
// import { useCharBullet } from "../hooks/useCharBullet";
// import { SHOOT_INTERVAL_MS } from "../config/game";


extend({
  Container,
  Text,
});

const Game = () => {
  const { app } = useApplication();

  // 血量 & 是否結束遊戲
  // const { hearts, takeDamage, isGameOver } = useHearts();

  // 角色
  const { charRef, moveDir } = useCharacter();
  // 角色子彈狀態
  const { charBullets, handleCharBulletMount, onCharFire, updateCharBullets } = useCharBullet();

  // 幽靈群
  const { ghosts, ghostRefs, handleGhostMount, handleGhostBatchDelete } = useGhost();
  // 幽靈群組
  const { ghostGroupRef, bobbing } = useGhostGroupMovement();

  // 幽靈子彈狀態
  // const { bullets, createBullet, updateBullets } = useGhostBullet(takeDamage);



  // Game Loop
  useEffect(() => {
    // 角色每隔 2 秒發射子彈
    const timer = setInterval(() => {
      onCharFire(charRef);
    }, SHOOT_INTERVAL_MS);

    const gameLoop = (ticker: Ticker) => {
      // 更新角色位置
      if (charRef.current && moveDir.current !== 0) {
        const nextX = Math.max(
          LEFT_BOUND,
          Math.min(RIGHT_BOUND, charRef.current.x + MOVE_SPEED * moveDir.current)
        );
        charRef.current.x = nextX;
      }

      
      // 控制幽靈群組位置 & 上下漂浮
      if(!ghostGroupRef.current) return;
      bobbing(ticker.deltaTime);


      // 更新角色子彈
      updateCharBullets(ticker.deltaTime, ghostRefs, handleGhostBatchDelete);
    };

    app.ticker.add(gameLoop);

    return () => {
      app.ticker.remove(gameLoop);
      clearInterval(timer)
    };
  }, [onCharFire]);
  
  // 控制射擊的方法
  // const handleGhostShoot = useCallback(
  //   (x: number, y: number) => {
  //     if (isGameOver) return; // 遊戲結束後不再射擊

  //     createBullet(x + groupX, y + groupY.current, 3);
  //   },
  //   [groupX, isGameOver, createBullet, groupY]
  // );

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     onCharFire(charX.current);
  //   }, SHOOT_INTERVAL_MS);

  //   return () => clearInterval(timer);
  // }, [onCharFire]);

  // useEffect(() => {
  //   // 用 ticker 滑順處理動畫相關狀態
  //   // 1. 幽靈的晃動
  //   // 2. 幽靈子彈移動
  //   // 3. 幽靈子彈的碰撞
  //   const tick = (ticker: Ticker) => {
  //     if (isGameOver) {
  //       app.ticker.remove(tick);
  //       return;
  //     }

  //     updateBullets(ticker.deltaTime, charX.current);
  //     updateCharBullets(ticker.deltaTime, ghosts.current, groupX, groupY.current);
  //   };

  //   app.ticker.add(tick);

  //   return () => {
  //     app.ticker.remove(tick);
  //   };
  // }, [app, isGameOver, updateBullets, bobbing, updateCharBullets, ghosts, groupX, groupY]);


  return (
    <pixiContainer x={0} y={0}>
      {/* Hearts */}
      {/* <pixiContainer x={30} y={20}>
        {hearts.current.map((heart) => (
          <Heart key={heart.x} x={heart.x} type={heart.type} />
        ))}
      </pixiContainer> */}

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
            // onShoot={handleGhostShoot}
          />
        ))}
      </pixiContainer>

      {/* Render all ghost bullets */}
      {/* {!isGameCompleted && !isGameOver && bullets.map((bullet) => (
        <GhostBullet
          key={bullet.id}
          x={bullet.x}
          y={bullet.y}
        />
      ))} */}

      <Character ref={charRef} />
      {/* {!isGameOver && (
        <Character x={charX.current} />
      )} */}

      {/* 角色子彈 */}
      {/* {!isGameCompleted && !isGameOver && charBullets.current.map((bullet) => ( */}
      {charBullets.map((bullet) => (
        <CharBullet
          id={bullet.id}
          key={bullet.id}
          x={bullet.x}
          y={bullet.y}
          onMount={handleCharBulletMount}
        />
      ))}

      {/* {(isGameCompleted || isGameOver) && (
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
      )} */}

      {/* Background */}
      <Background />
    </pixiContainer>
  );
};

export default Game;