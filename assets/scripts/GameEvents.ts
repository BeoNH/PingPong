/** Tên event gameplay — payload types xem `GameType.ts`. */
export const GAME_EVENTS = {
    PADDLE_HIT: 'paddle-hit',
    BALL_OUT: 'ball-out',
    BALL_EXITED: 'ball-exited',
    SCORE_CHANGED: 'score-changed',
    MATCH_ENDED: 'match-ended',
    PLAYER_PADDLE_INPUT: 'player-paddle-input',
} as const;
