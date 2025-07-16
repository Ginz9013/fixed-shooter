import { useRef } from "react";

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
  const hearts = useRef<HeartInfo[]>(defaultHearts);
  // 使用 useRef 來儲存 isGameOver 的最新狀態
  const isGameOverRef = useRef(hearts.current.length <= 0);

  const takeDamage = () => {
    const newHearts = hearts.current.length > 0 ? hearts.current.slice(0, -1) : hearts.current;
    isGameOverRef.current =  newHearts.length <= 0;
    hearts.current = newHearts;
  }

  // 回傳 isGameOverRef 的 current 值
  return {
    hearts,
    isGameOver: isGameOverRef.current,
    takeDamage,
  };
};
