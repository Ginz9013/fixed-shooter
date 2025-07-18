import { useCallback, useEffect, useMemo, useState } from "react";
import { type Ticker } from "pixi.js";
import { useApplication } from "@pixi/react";
import { useGhost } from "./useGhost";
import { useGhostGroupMovement } from "./useGhostGroupMovement";
import { useCharacter } from "./useCharacter";
import { useCharBullet } from "./useCharBullet";
import { useHearts } from "./useHearts";
import { useGhostBullet } from "./useGhostBullet";
import { SHOOT_INTERVAL_MS, LEFT_BOUND, RIGHT_BOUND, MOVE_SPEED, SHOOTING_PROBABILITY } from "../config/game";
import type { CharacterSpec } from "../config/characters";


export const useGameManager = (characterSpec: CharacterSpec) => {
  const { app } = useApplication();

  // 血量 & 是否結束遊戲 (使用 characterSpec 初始化)
  const { hearts, takeDamage } = useHearts(characterSpec.initialHealth);

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

  // 計時
  const [timing, setTiming] = useState<number>(60);

  // 分數
  const [score, setScore] = useState<number>(0);

  // 遊戲結束
  const isGameOver = useMemo(() => hearts.length <= 0 || timing <= 0, [hearts, timing]);
  const isGameCompleted = useMemo(() => ghosts.length <= 0, [ghosts]);

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
    const shootInterval = SHOOT_INTERVAL_MS / characterSpec.attackSpeedModifier;
    const shootTimer = setInterval(() => {
      // 將連射設定傳遞給 onCharFire
      onCharFire(charRef, characterSpec.burstFire);
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
      updateCharBullets(ticker.deltaTime, ghostRefs, handleGhostBatchDelete, addScore);

      
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
      });

      // 更新幽靈子彈位置
      updateGhostBullets(ticker.deltaTime, charRef.current, takeDamage);
    };

    app.ticker.add(gameLoop);

    return () => {
      app.ticker.remove(gameLoop);
    };
  }, [
    app.ticker,
    characterSpec, // 將 characterSpec 加入依賴
    charRef,
    moveDir,
    onCharFire,
    updateCharBullets,
    ghostRefs,
    bobbing,
    onGhostFire,
    updateGhostBullets,
    handleGhostBatchDelete,
    takeDamage,
    addScore,
    clearGhostBullets,
    clearCharBullets,
    isGameCompleted,
    isGameOver,
    setTiming,
  ]);

  // 當遊戲結束時，清空子彈並停止遊戲
  useEffect(() => {
    if (isGameOver || isGameCompleted) {
      clearGhostBullets();
      clearCharBullets();
      return;
    };
  }, [isGameOver, isGameCompleted]);

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
    // 遊戲狀態
    isGameOver,
    isGameCompleted,
  };
}