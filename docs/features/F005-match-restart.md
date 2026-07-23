# F005 — Chơi lại sau khi kết thúc trận

| Trường | Giá trị |
|--------|---------|
| **ID** | F005 |
| **Trạng thái** | `done` |
| **Module** | M01, M05, M08 ([01-MODULES.md](../01-MODULES.md)) |
| **Ngày tạo** | 2026-07-23 |

---

## Mục tiêu

Hoàn thiện luồng game: sau khi một bên thắng (đạt 5 điểm), người chơi có thể **chơi lại** ngay trong scene `Game` mà không cần thoát Play mode.

## Phạm vi

### Trong phạm vi

- Nút **Chơi lại** hiện khi trận kết thúc
- Reset tỉ số, vị trí vợt/bóng, bắt đầu trận mới
- HUD cập nhật tỉ số về 0–0

### Ngoài phạm vi

- Scene Menu / GameOver riêng
- Chọn độ khó trước khi chơi lại

## Acceptance criteria

- [x] Trận kết thúc → hiện message thắng/thua + nút Chơi lại
- [x] Bấm Chơi lại → tỉ số 0–0, vợt/bóng reset, rally mới bắt đầu
- [x] Nút ẩn khi đang chơi (trước GameOver)
- [x] `npm run lint` pass

## Thiết kế kỹ thuật

### File tạo / sửa

| File | Hành động | Ghi chú |
|------|-----------|---------|
| `ScoreManager.ts` | modify | `resetScores()` |
| `GameManager.ts` | modify | `restartMatch()` |
| `HudController.ts` | modify | Nút + handler |
| `Game.scene` | modify | Node RestartButton, wire refs |

### Scene / Prefab (Human — Editor)

- Node `HUD/RestartButton` (Button + Label "Chơi lại")
- Wire `HudController.restartButton`, bind click → `onRestartClicked`

### Events / API

| Event / Method | Mô tả |
|----------------|-------|
| `ScoreManager.resetScores()` | Đặt 0–0, emit `score-changed` |
| `GameManager.restartMatch()` | Chỉ từ `GameOver`; reset và serve lại |

## Plan

- [x] `ScoreManager.resetScores()`, `GameManager.restartMatch()`
- [x] `HudController` — show/hide nút, handler click
- [x] Scene: RestartButton + wire
- [x] Human: `/review-done F005`

## Liên kết

- GDD: [00-GDD.md](../00-GDD.md)
- Architecture: [03-ARCHITECTURE.md](../03-ARCHITECTURE.md)
