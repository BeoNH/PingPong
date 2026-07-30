/** Types, enums và hằng số gameplay dùng chung. */

/** Dữ liệu người chơi sau đăng nhập API. */
export interface UserData {
    userName?: string;
}

export const userDATA: UserData = {};

export const SCENE_NAMES = {
    MENU: 'Menu',
    GAME: 'Game',
} as const;

export type SceneName = (typeof SCENE_NAMES)[keyof typeof SCENE_NAMES];

export const DESIGN_WIDTH = 1280;
export const DESIGN_HEIGHT = 720;

export const COURT_BOUNDS = {
    left: -500,
    right: 500,
    bottom: -240,
    top: 240,
} as const;

export const GOAL_BOUNDS = {
    bottom: -150,
    top: 150,
} as const;

/** Vị trí X vợt/serve — player phải, AI trái. */
export const COURT_LAYOUT = {
    playerPaddleX: 370,
    aiPaddleX: -370,
    playerServeX: 160,
    aiServeX: -160,
} as const;

/** Hướng giao bóng theo trục X — player phải giao sang trái (-1). */
export const SERVE_DIR = {
    PLAYER: -1,
    AI: 1,
} as const;

export type ServeDirection = (typeof SERVE_DIR)[keyof typeof SERVE_DIR];

export const SCENE_NODE_NAMES = {
    BG: 'BG',
    CAMERA: 'Camera',
} as const;

/** Tạm ẩn UI chọn độ khó Menu — mặc định AI Vừa. */
export const SHOW_DIFFICULTY_UI = false;

export type PaddleSide = 'player' | 'ai';

export interface PaddleHitPayload {
    side: PaddleSide;
    hitOffset: number;
    x: number;
    y: number;
}

export interface BallOutPayload {
    scorer: PaddleSide;
}

export interface ScoreChangedPayload {
    player: number;
    ai: number;
}

export interface MatchEndedPayload {
    winner: PaddleSide;
}

export enum GameState {
    Intro = 'Intro',
    Serving = 'Serving',
    Playing = 'Playing',
    PointScored = 'PointScored',
    GameOver = 'GameOver',
}
