export const SCENE_NAMES = {
    MENU: 'Menu',
    GAME: 'Game',
} as const;

export type SceneName = (typeof SCENE_NAMES)[keyof typeof SCENE_NAMES];
