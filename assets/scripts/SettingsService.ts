import { sys } from 'cc';

const STORAGE_KEYS = {
    SOUND: 'pingpong.settings.sound',
    EFFECT: 'pingpong.settings.effect',
} as const;

const DEFAULT_ENABLED = true;

function readBool(key: string, defaultValue: boolean): boolean {
    const raw = sys.localStorage.getItem(key);

    if (raw === null) {
        return defaultValue;
    }

    return raw === '1' || raw === 'true';
}

function writeBool(key: string, value: boolean): void {
    sys.localStorage.setItem(key, value ? '1' : '0');
}

/** Đọc/ghi cài đặt âm thanh và hiệu ứng rung qua localStorage. */
export const SettingsService = {
    isSoundEnabled(): boolean {
        return readBool(STORAGE_KEYS.SOUND, DEFAULT_ENABLED);
    },

    setSoundEnabled(value: boolean): void {
        writeBool(STORAGE_KEYS.SOUND, value);
    },

    isEffectEnabled(): boolean {
        return readBool(STORAGE_KEYS.EFFECT, DEFAULT_ENABLED);
    },

    setEffectEnabled(value: boolean): void {
        writeBool(STORAGE_KEYS.EFFECT, value);
    },
} as const;
