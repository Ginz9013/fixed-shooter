import { useCallback, useEffect, useMemo, useState } from "react";
import { type Ticker } from "pixi.js";
import { useApplication } from "@pixi/react";
import { useGhost } from "./useGhost";
import { useGhostGroupMovement } from "./useGhostGroupMovement";
import { useCharacter } from "./useCharacter";
import { useCharBullet } from "./useCharBullet";
import { useHearts } from "./useHearts";
import { useGhostBullet } from "./useGhostBullet";
import { useCharBomb } from "./useCharBomb";
import {
  SHOOT_INTERVAL_MS,
  LEFT_BOUND,
  RIGHT_BOUND,
  MOVE_SPEED,
  SHOOTING_PROBABILITY,
  BOSS_GHOST_SCORE,
  MIDDLE_GHOST_SCORE,
  NORMAL_GHOST_SCORE,
  GHOST_BULLET_SPEED,
  COUNTDOWN_TIMER,
} from "../config/game";
import type { CharacterSpec } from "../config/characters";
import { ghostRespawn } from "../utils/game";


export const useGameManager = (characterSpec: CharacterSpec) => {
  const { app } = useApplication();

  // 血量 & 是否結束遊戲 (使用 characterSpec 初始化)
  const { hearts, takeDamage } = useHearts(characterSpec.initialHealth);

  // 角色
  const { charRef, moveDir } = useCharacter();
  // 角色子彈狀態
  const { charBullets, handleCharBulletMount, clearCharBullets, onCharFire, updateCharBullets } = useCharBullet();
  // 角色炸彈狀態
  const { charBombs, handleCharBombMount, onCharFireBomb, updateCharBombs } = useCharBomb();

  // 幽靈群
  const { ghosts, ghostRefs, handleGhostMount, handleGhostBatchDefeat, handleGhostBatchRespawn } = useGhost();
  // 幽靈群組
  const { ghostGroupRef, bobbing } = useGhostGroupMovement();
  // 幽靈子彈狀態
  const { ghostBullets, handleGhostBulletMount, clearGhostBullets, onGhostFire, updateGhostBullets } = useGhostBullet();

  // 計時
  const [timing, setTiming] = useState<number>(60);

  // 分數
  const [score, setScore] = useState<number>(0);

  // 遊戲結束
  const isGameOver = useMemo(() => hearts.length <= 0 || timing <= 0, [hearts, timing]);
  // const isGameCompleted = useMemo(() => ghosts.every(ghost => ghost.defeatedAt !== null), [ghosts]);

  // 加分方法
  const addScore = useCallback((score: number) => setScore(prev => prev + score), []);


  // 倒數計時
  useEffect(() => {
    const countDownTimer = setInterval(() => {
      setTiming(prev => prev - 1);
    }, 1000);

    return () => clearInterval(countDownTimer);
  }, []);


  // 每 2 秒角色射擊一次
  useEffect(() => {
    // 根據角色攻速調整射擊間隔
    const shootInterval = SHOOT_INTERVAL_MS * characterSpec.attackSpeedModifier;
    const shootTimer = setInterval(() => {
      // 將連射設定傳遞給 onCharFire
      onCharFire(charRef, characterSpec.fire);
    }, shootInterval);
    
    return () => clearInterval(shootTimer);
  }, []);

  // 每 N 秒角色丟一次炸彈
  useEffect(() => {
    // 如果沒有特殊能力就直接停止這個功能
    if (characterSpec.special.type === "NONE") return;

    // 根據角色特殊能力設定發射炸彈
    const shootInterval = characterSpec.special.cooldown;
    const bombType = characterSpec.special.type;

    const shootTimer = setInterval(() => {
      // 將連射設定傳遞給 onCharFire
      onCharFireBomb(charRef, bombType);
    }, shootInterval);
    
    return () => clearInterval(shootTimer);
  }, []);


  // Game Loop
  useEffect(() => {
    // 主要的遊戲循環
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
      const ghostToRemoveByBullets = updateCharBullets(ticker.deltaTime, ghostRefs);

      // 更新角色炸彈
      const ghostToRemoveByBombs = updateCharBombs(ticker.deltaTime, characterSpec.special.type, ghostRefs);

      // 更新幽靈
      const ghostToRemove = new Set<number>([...ghostToRemoveByBullets, ...ghostToRemoveByBombs]);
      handleGhostBatchDefeat(ghostToRemove);

      // 更新分數
      const totalScore = Array.from(ghostToRemove).reduce((totalScore, ghostId) => {
        const ghostType = ghosts.current.get(ghostId)?.type;
        
        const scoreOfType = ghostType === "boss"
          ? BOSS_GHOST_SCORE
          : ghostType === "middle"
            ? MIDDLE_GHOST_SCORE
            : NORMAL_GHOST_SCORE;
        
        return totalScore += scoreOfType;
      }, 0);
      addScore(totalScore);

      
      // 控制幽靈群組位置 & 上下漂浮
      bobbing(ticker.deltaTime);

      // 幽靈根據機率發射子彈
      const probabilyty = timing <= COUNTDOWN_TIMER
        ? SHOOTING_PROBABILITY * 3
        : SHOOTING_PROBABILITY;
      ghostRefs.current.forEach(ghost => {
        if (ghost.visible && Math.random() < probabilyty && !isGameOver) onGhostFire(ghost);
      });

      // 更新幽靈子彈位置
      const bulletSpeed = timing <= COUNTDOWN_TIMER
        ? GHOST_BULLET_SPEED + 3
        : GHOST_BULLET_SPEED;
      updateGhostBullets(ticker.deltaTime, charRef.current, bulletSpeed, takeDamage);

      // 幽靈重生
      ghostRespawn(ghostRefs, ghosts, handleGhostBatchRespawn);
    };

    app.ticker.add(gameLoop);

    return () => {
      app.ticker.remove(gameLoop);
    };
  }, [
    app.ticker,
    characterSpec, // 將 characterSpec 加入依賴
    moveDir,
    onCharFire,
    updateCharBullets,
    updateCharBombs,
    ghosts, // 依賴 ghosts 狀態
    ghostRefs, // 依賴 ghostRefs
    bobbing,
    onGhostFire,
    updateGhostBullets,
    handleGhostBatchDefeat,
    handleGhostBatchRespawn,
    takeDamage,
    addScore,
    clearGhostBullets,
    clearCharBullets,
    isGameOver,
    setTiming,
  ]);

  // 當遊戲結束時，清空子彈並停止遊戲
  useEffect(() => {
    if (isGameOver) {
      clearGhostBullets();
      clearCharBullets();
      return;
    };
  }, [isGameOver]);

  return {
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
    // 角色炸彈
    charBombs,
    handleCharBombMount,
    // 遊戲狀態
    isGameOver,
  };
};