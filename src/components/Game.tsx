import { useState } from "react";
import { extend } from "@pixi/react";
import { Container, Text } from "pixi.js";

import Background from "../components/Background";
import Ghost from "../components/Ghost";
import Character from "./Character";
import CharBullet from "./CharBullet";
import Heart from "./Heart";
import GhostBullet from "./GhostBullet";

import { useGameManager } from "../hooks/useGameManager";
import { CHARACTER_SPECS, type CharacterSpec } from "../config/characters";

import {
  GHOST_GROUP_INIT_X,
  GHOST_GROUP_INIT_Y,
} from "../config/game";


extend({
  Container,
  Text,
});

const Game = () => {
  // 預設選擇一台戰機，未來可以讓玩家選擇
  const [character, _setCharacter] = useState<CharacterSpec>(CHARACTER_SPECS.blue);

  // 呼叫核心邏輯 Hook
  const {
    // 愛心
    hearts,
    // 分數
    score,
    // 倒數計時
    timing,
    // 幽靈
    ghosts,
    ghostGroupRef,
    handleGhostMount,
    // 幽靈子彈
    ghostBullets,
    handleGhostBulletMount,
    // 角色
    charRef,
    // 角色子彈
    charBullets,
    handleCharBulletMount,
    // 遊戲狀態
    isGameOver,
    isGameCompleted,
  } = useGameManager(character);


  return (
    <pixiContainer x={0} y={0}>
      {/* 愛心 */}
      <pixiContainer x={30} y={20}>
        {hearts.map((heart) => (
          <Heart key={heart.x} x={heart.x} type={heart.type} />
        ))}
      </pixiContainer>

      {/* 分數 */}
      {!isGameCompleted && !isGameOver && (
        <pixiText
          text={score}
          x={768 / 2 + 50}
          y={50}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fill: "white",
            fontSize: 48,
            fontWeight: "bold",
          }}
        />
      )}

      {/* 倒數計時 */}
      {!isGameCompleted && !isGameOver && (
        <pixiText
          text={timing}
          x={768 - 70}
          y={50}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fill: "white",
            fontSize: 36,
            fontWeight: "bold",
          }}
        />
      )}

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

      {!isGameOver && <Character ref={charRef} charId={character.id} />}

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