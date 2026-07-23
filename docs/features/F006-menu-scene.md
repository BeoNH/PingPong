# F006 — Scene Menu & luồng chuyển scene

| Trường | Giá trị |
|--------|---------|
| **ID** | F006 |
| **Trạng thái** | `done` |
| **Module** | M09 ([01-MODULES.md](../01-MODULES.md)) |
| **Ngày tạo** | 2026-07-23 |

---

## Mục tiêu

Thêm scene **Menu** làm điểm vào game: chọn Chơi → vào `Game`; sau trận có thể quay lại Menu. Bỏ qua Audio (chưa có asset).

## Phạm vi

### Trong phạm vi

- Scene `Menu` — title + nút **Chơi**
- `Menu` → `Game` qua `director.loadScene`
- `Game` GameOver — nút **Menu** quay về Menu
- Launch scene = `Menu`

### Ngoài phạm vi

- Boot scene, Settings, chọn độ khó
- Audio (M07 — chưa có file)

## Acceptance criteria

- [x] Play từ Menu → load scene Game, gameplay chạy bình thường
- [x] GameOver → nút Menu → quay lại Menu
- [x] Launch scene là Menu (mở project Play từ Menu)
- [x] `npm run lint` pass

## Thiết kế kỹ thuật

### File tạo / sửa

| File | Hành động | Ghi chú |
|------|-----------|---------|
| `SceneNames.ts` | create | Hằng tên scene |
| `utils/SceneLoader.ts` | create | `loadScene()` wrapper |
| `MenuController.ts` | create | Nút Chơi |
| `HudController.ts` | modify | Nút Menu khi GameOver |
| `assets/scenes/Menu.scene` | create | UI menu |
| `assets/scenes/Game.scene` | modify | MenuButton |

### Scene / Prefab (Human — Editor)

- Project Settings → Launch Scene = `Menu` (nếu MCP chưa set được)
- Wire `MenuController.playButton`, `HudController.menuButton`

## Plan

- [x] Script: SceneNames, SceneLoader, MenuController
- [x] Scene Menu (Canvas, title, PlayButton)
- [x] Game: MenuButton + HudController wire
- [x] Launch scene Menu + sync docs
- [x] Human: `/review-done F006`

## Liên kết

- GDD: [00-GDD.md](../00-GDD.md)
- Architecture: [03-ARCHITECTURE.md](../03-ARCHITECTURE.md)
