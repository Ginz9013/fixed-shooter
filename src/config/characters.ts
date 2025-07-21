export interface SpecialAbility {
  type: "BIG_BOMB" | "SMALL_BOMB" | "NONE";
  cooldown: number; // in milliseconds
}

export interface CharacterSpec {
  id: string;
  name: string;
  // 連射設定
  burstFire: {
    // 連射的子彈數量
    count: number;
    // 連射時，每發子彈之間的間隔時間 (毫秒)
    delayMs: number;
  };
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
    burstFire: { count: 1, delayMs: 0 },
    attackSpeedModifier: 1,
    initialHealth: 3,
    special: { type: "NONE", cooldown: 0 },
  },
  // 一次連射 4 枚子彈 + 大炸彈(10s)  + 攻速 +30%
  yellow: {
    id: "yellow",
    name: "レンジャー（イエロー）",
    burstFire: { count: 4, delayMs: 150 },
    attackSpeedModifier: 0.7,
    initialHealth: 3,
    special: { type: "BIG_BOMB", cooldown: 10000 },
  },
  // 一次連射 4 枚子彈 + 攻速 +30%
  pink: {
    id: "pink",
    name: "レンジャー（ピンク）",
    burstFire: { count: 4, delayMs: 150 },
    attackSpeedModifier: 0.7,
    initialHealth: 3,
    special: { type: "NONE", cooldown: 0 },
  },
  // 一次連射 3 枚子彈 + 攻速 +15%
  green: {
    id: "green",
    name: "レンジャー（グリーン）",
    burstFire: { count: 3, delayMs: 150 },
    attackSpeedModifier: 0.85,
    initialHealth: 3,
    special: { type: "NONE", cooldown: 0 },
  },
  // 一次連射 3 枚子彈 + 多 2 血
  blue: {
    id: "blue",
    name: "レンジャー（ブルー）",
    burstFire: { count: 3, delayMs: 150 },
    attackSpeedModifier: 1,
    initialHealth: 5, // 3 + 2
    special: { type: "NONE", cooldown: 0 },
  },
  // 一次連射 3 枚子彈 + 小炸彈(20s)  + 攻速 +15%
  kappa: {
    id: "kappa",
    name: "河童（かっぱ）",
    burstFire: { count: 3, delayMs: 150 },
    attackSpeedModifier: 0.85,
    initialHealth: 3,
    special: { type: "SMALL_BOMB", cooldown: 20000 },
  },
};

export type CharacterId = keyof typeof CHARACTER_SPECS;