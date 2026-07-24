export enum AiDifficultyLevel {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard',
}

export interface AiDifficultyPreset {
    moveSpeed: number;
    reactionDelay: number;
    aimError: number;
    chaseThresholdX: number;
}

const AI_DIFFICULTY_PRESETS: Record<AiDifficultyLevel, AiDifficultyPreset> = {
    [AiDifficultyLevel.Easy]: {
        moveSpeed: 240,
        reactionDelay: 0.24,
        aimError: 90,
        chaseThresholdX: 220,
    },
    [AiDifficultyLevel.Medium]: {
        moveSpeed: 320,
        reactionDelay: 0.14,
        aimError: 60,
        chaseThresholdX: 140,
    },
    [AiDifficultyLevel.Hard]: {
        moveSpeed: 380,
        reactionDelay: 0.09,
        aimError: 40,
        chaseThresholdX: 90,
    },
};

const AI_DIFFICULTY_LABELS: Record<AiDifficultyLevel, string> = {
    [AiDifficultyLevel.Easy]: 'Dễ',
    [AiDifficultyLevel.Medium]: 'Vừa',
    [AiDifficultyLevel.Hard]: 'Khó',
};

let selectedLevel: AiDifficultyLevel = AiDifficultyLevel.Medium;

export function getSelectedAiDifficulty(): AiDifficultyLevel {
    return selectedLevel;
}

export function setSelectedAiDifficulty(level: AiDifficultyLevel): void {
    selectedLevel = level;
}

export function getAiDifficultyPreset(level: AiDifficultyLevel): AiDifficultyPreset {
    return AI_DIFFICULTY_PRESETS[level];
}

export function getAiDifficultyLabel(level: AiDifficultyLevel): string {
    return AI_DIFFICULTY_LABELS[level];
}
