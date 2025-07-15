import { useState, useRef } from "react";

// 血量型態
type HeartType = "heart" | "shield";

// 定義血量資訊
export interface HeartInfo {
  x: number;
  type: HeartType;
}

const defaultHearts: HeartInfo[] = [
  { x: 0, type: "heart" },
  { x: 60, type: "heart" },
  { x: 120, type: "heart" },
  { x: 180, type: "shield" },
];

export const useHearts = () => {
  // 血量
  const [hearts, setHearts] = useState<HeartInfo[]>(defaultHearts);
  // 使用 useRef 來儲存 isGameOver 的最新狀態
  const isGameOverRef = useRef(hearts.length <= 0);

  const takeDamage = () =>
    setHearts((prev) => {
      const newHearts = prev.length > 0 ? prev.slice(0, -1) : prev;
      // 在更新 hearts 狀態後，立即更新 isGameOverRef 的值
      isGameOverRef.current = newHearts.length <= 0;
      return newHearts;
    });

  // 回傳 isGameOverRef 的 current 值
  return {
    hearts,
    isGameOver: isGameOverRef.current,
    takeDamage,
  };
};
