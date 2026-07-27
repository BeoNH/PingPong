/** Cờ phiên — chỉ intro Game khi vào từ Menu (không áp dụng Chơi lại). */

let enterGameFromMenu = false;

/** Gọi trước `loadScene(Game)` từ Menu. */
export function markGameEntryFromMenu(): void {
    enterGameFromMenu = true;
}

/** Trả về `true` một lần nếu vừa vào Game từ Menu. */
export function consumeGameIntroOnLoad(): boolean {
    if (!enterGameFromMenu) {
        return false;
    }

    enterGameFromMenu = false;
    return true;
}
