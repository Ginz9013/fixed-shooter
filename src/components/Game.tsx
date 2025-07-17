
import { extend } from "@pixi/react";
import { Container, Text } from "pixi.js";
import Background from "../components/Background";
import { useGhost } from "../hooks/useGhost";
import { useGhostGroupMovement } from "../hooks/useGhostGroupMovement";
import { useCharacter } from "../hooks/useCharacter";


import Ghost from "../components/Ghost";
import Character from "./Character";
// import GhostBullet from "./GhostBullet";
// import Heart from "./Heart";
// import CharBullet from "./CharBullet";
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

  // 血量 & 是否結束遊戲
  // const { hearts, takeDamage, isGameOver } = useHearts();

  // 幽靈群
  const { ghosts, handleGhostMount } = useGhost();
  // 幽靈群組
  const { ghostGroupRef } = useGhostGroupMovement();

  // 幽靈子彈狀態
  // const { bullets, createBullet, updateBullets } = useGhostBullet(takeDamage);

  // 角色
  const { charRef } = useCharacter();

  // 角色子彈狀態
  // const { charBullets, onCharFire, updateCharBullets } = useCharBullet(destroyGhost);

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
      <pixiContainer ref={ghostGroupRef}>
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

      {/* Render all character bullets */}
      {/* {!isGameCompleted && !isGameOver && charBullets.current.map((bullet) => (
        <CharBullet
          key={bullet.id}
          x={bullet.x}
          y={bullet.y}
        />
      ))} */}

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