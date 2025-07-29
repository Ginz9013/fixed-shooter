export interface SpecialAbility {
  type: "BIG_BOMB" | "SMALL_BOMB" | "NONE";
  cooldown: number; // in milliseconds
}

export interface CharacterSpec {
  id: string;
  name: string;
  // 子彈數量設定
  fire: {
    amount: number;
    gap: number;
  },
  // 射速倍率，0.85 代表 +15%
  attackSpeedModifier: number;
  initialHealth: number;
  special: SpecialAbility;
}

export const CHARACTER_SPECS: Record<string, CharacterSpec> = {
  // 預設機體 (單發)
  red: {
    id: "red",
    name: "レンジャー（レッド）",
    fire: { amount: 1, gap: 50 },
    attackSpeedModifier: 1,
    initialHealth: 3,
    special: { type: "NONE", cooldown: 0 },
  },
  // 4 枚子彈 + 大炸彈(10s)  + 攻速 +30%
  yellow: {
    id: "yellow",
    name: "レンジャー（イエロー）",
    fire: { amount: 4, gap: 50 },
    attackSpeedModifier: 0.7,
    initialHealth: 3,
    special: { type: "BIG_BOMB", cooldown: 10000 },
  },
  // 4 枚子彈 + 攻速 +30%
  pink: {
    id: "pink",
    name: "レンジャー（ピンク）",
    fire: { amount: 4, gap: 50 },
    attackSpeedModifier: 0.7,
    initialHealth: 3,
    special: { type: "NONE", cooldown: 0 },
  },
  // 3 枚子彈 + 攻速 +15%
  green: {
    id: "green",
    name: "レンジャー（グリーン）",
    fire: { amount: 3, gap: 50 },
    attackSpeedModifier: 0.85,
    initialHealth: 3,
    special: { type: "NONE", cooldown: 0 },
  },
  // 3 枚子彈 + 多 2 血
  blue: {
    id: "blue",
    name: "レンジャー（ブルー）",
    fire: { amount: 3, gap: 50 },
    attackSpeedModifier: 1,
    initialHealth: 5, // 3 + 2
    special: { type: "NONE", cooldown: 0 },
  },
  // 3 枚子彈 + 小炸彈(20s)  + 攻速 +15%
  kappa: {
    id: "kappa",
    name: "河童（かっぱ）",
    fire: { amount: 3, gap: 50 },
    attackSpeedModifier: 0.85,
    initialHealth: 3,
    special: { type: "SMALL_BOMB", cooldown: 20000 },
  },
};

export type CharacterId = keyof typeof CHARACTER_SPECS;