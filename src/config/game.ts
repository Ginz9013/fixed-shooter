// 場景
export const GAME_WIDTH = 768;

// 角色
export const CHARACTER_SIZE = 60;
export const LEFT_BOUND = 0;
export const RIGHT_BOUND = 768 - CHARACTER_SIZE;
export const MOVE_SPEED = 5;
export const CHARACTER_Y_POSITION = window.innerHeight - 150;
export const CHARACTER_X_INIT_POSITION = (768 - CHARACTER_SIZE) / 2;

// 角色子彈
export const CHAR_BULLET_WIDTH = 40;
export const CHAR_BULLET_HEIGHT = 100;
export const CHAR_BULLET_SPEED = 10;
export const SHOOT_INTERVAL_MS = 2000;

// 角色炸彈
export const CHAR_BOMB_WIDTH = 60;
export const CHAR_BOMB_HEIGHT = 60;
export const CHAR_BOMB_SPEED = 5;
export const CHAR_SMALL_BOMB_SCOPE = 100;
export const CHAR_BIG_BOMB_SCOPE = 200;

// 幽靈
export const GHOST_WIDTH = 50;
export const GHOST_HEIGHT = 50;

// 幽靈群組
export const GHOST_GROUP_INIT_X = (768 - 550) / 2;
export const GHOST_GROUP_INIT_Y = 100;

// 幽靈子彈
export const SHOOTING_PROBABILITY = 0.001;
export const GHOST_BULLET_SPEED = 3;