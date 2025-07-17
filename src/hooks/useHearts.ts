import { useState } from "react";

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

  const takeDamage = () => setHearts(prev => prev.length > 0 ? prev.slice(0, -1) : prev);

  return {
    hearts,
    takeDamage,
  };
};
