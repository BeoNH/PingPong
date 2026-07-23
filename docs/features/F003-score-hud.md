# F003 — Ghi điểm & HUD

| Trường | Giá trị |
|--------|---------|
| **ID** | F003 |
| **Trạng thái** | `done` |
| **Module** | M05, M08 ([01-MODULES.md](../01-MODULES.md)) |
| **Ngày tạo** | 2026-07-23 |

---

## Mục tiêu

Trận đấu có điểm số và điều kiện thắng (5 điểm — theo GDD); HUD hiển thị tỉ số và thông báo thắng/thua.

## Phạm vi

### Trong phạm vi

- `ScoreManager`: cộng điểm khi `ball-out`, kiểm tra win (5 điểm)
- `HudController`: Label tỉ số player/AI + message thắng
- `GameManager`: pause 1s giữa các điểm; `GameOver` + `match-ended`
- Event `score-changed`, `match-ended`

### Ngoài phạm vi

- Menu restart / rematch
- Âm thanh ghi điểm (M07)
- Animation HUD

## Acceptance criteria

- [x] Ghi điểm đúng khi bóng qua biên
- [x] HUD cập nhật tỉ số realtime
- [x] Đạt 5 điểm → dừng trận, hiện thông báo thắng
- [x] `npm run lint` pass
- [x] Docs cập nhật

## Plan

- [x] `GameEvents.ts` — thêm events score/match
- [x] `ScoreManager.ts`, `HudController.ts`
- [x] `GameManager.ts` — tích hợp score + delay
- [x] Scene: node HUD + Labels
- [x] Cập nhật docs
- [x] Human: Play mode — `/review-done F003`

## Liên kết

- GDD: [00-GDD.md](../00-GDD.md) — session ~5 điểm
- F002: [F002-ai-paddle.md](F002-ai-paddle.md)
