export const GAME_EVENTS = {
    PADDLE_HIT: 'paddle-hit',
    BALL_OUT: 'ball-out',
    SCORE_CHANGED: 'score-changed',
    MATCH_ENDED: 'match-ended',
} as const;

export type PaddleSide = 'player' | 'ai';

export interface PaddleHitPayload {
    side: PaddleSide;
    hitOffset: number;
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
    Ready = 'Ready',
    Serving = 'Serving',
    Playing = 'Playing',
    PointScored = 'PointScored',
    GameOver = 'GameOver',
}
