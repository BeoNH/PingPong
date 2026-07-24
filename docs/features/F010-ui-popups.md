# F010 — Popup GameOver & hướng dẫn Menu

| Trường | Giá trị |
|--------|---------|
| **ID** | F010 |
| **Trạng thái** | `done` |
| **Module** | M08, M09 |
| **Ngày tạo** | 2026-07-24 |

---

## Mục tiêu

Popup Game Over trên scene Game và popup hướng dẫn trên Menu, có hiệu ứng xuất hiện/ẩn.

## Acceptance criteria

- [x] Game Over: popup overlay + panel, nút Chơi lại / Menu, tween show/hide
- [x] Menu: nút Hướng dẫn mở popup; nút Đóng ẩn popup (tween)
- [x] Restart ẩn popup rồi chơi lại; gameplay/hud score vẫn hoạt động
- [x] `npm run lint` pass

## Thiết kế

| File | Hành động |
|------|-----------|
| `UiPopup.ts` | base — tween bg/container, PopupRoot, destroyOnHide |
| `popups/GameOverPopup.ts` | create — sự kiện Chơi lại / Menu |
| `popups/TutorialPopup.ts` | create — sự kiện Đóng |
| `HudController.ts` | spawn prefab GameOverPopup |
| `MenuController.ts` | spawn prefab TutorialPopup |
| `assets/prefabs/*.prefab` | create — cấu trúc bg + container + panel con |
| Scene | `PopupRoot` trên Canvas; xóa popup embed cũ (nếu còn) |

## Plan

- [x] Spec + UiPopup
- [x] Scene Game GameOverPopup
- [x] Scene Menu TutorialPopup
- [x] Sync docs + lint
- [x] Human: `/review-done F010`
