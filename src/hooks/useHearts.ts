import { useCallback, useState } from "react";

export interface HeartData {
  x: number;
  type: "heart" | "shield";
}

export const useHearts = (initialHealth: number) => {
  const [hearts, setHearts] = useState<HeartData[]>(
    Array.from({ length: initialHealth }, (_, i) => ({
      x: i * 40,
      type: i < 3 ? "heart" : "shield",
    }))
  );

  const takeDamage = useCallback(() => {
    setHearts(prev => prev.slice(0, -1));
  }, []);

  return { hearts, takeDamage };
};
