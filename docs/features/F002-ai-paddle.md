# F002 — AI vợt (đuổi bóng cơ bản)

| Trường | Giá trị |
|--------|---------|
| **ID** | F002 |
| **Trạng thái** | `done` |
| **Module** | M04 ([01-MODULES.md](../01-MODULES.md)) |
| **Người tạo** | Agent |
| **Ngày tạo** | 2026-07-23 |

---

## Mục tiêu

Có đối thủ AI ở phía phải: vợt AI đuổi bóng, đánh trả; bóng qua biên trái/phải → `ball-out` (chưa ghi điểm UI — F003).

## Phạm vi

### Trong phạm vi

- `AiPaddle` di chuyển dọc theo vị trí bóng (tốc độ giới hạn)
- `BallController` va chạm vợt AI; bỏ reflect biên trái/phải → phát `ball-out`
- `GameManager` lắng nghe `ball-out`, reset serve (luân phiên hướng giao)
- Refactor `PaddleBase` — logic va chạm dùng chung

### Ngoài phạm vi

- Ghi điểm & HUD (F003)
- Độ khó AI nhiều mức
- Âm thanh

## Acceptance criteria

- [x] Play mode: AI đuổi và đánh trả bóng
- [x] Bóng qua vợt → reset serve (không reflect tường ngang)
- [x] Rally player ↔ AI ổn định
- [x] `npm run lint` pass
- [x] Docs cập nhật

## Thiết kế kỹ thuật

| File | Hành động |
|------|-----------|
| `assets/scripts/PaddleBase.ts` | create |
| `assets/scripts/AiPaddle.ts` | create |
| `assets/scripts/PlayerPaddle.ts` | modify — extends PaddleBase |
| `assets/scripts/BallController.ts` | modify — AI collision + ball-out |
| `assets/scripts/GameManager.ts` | modify — ball-out → reset serve |
| `assets/scenes/Game.scene` | modify — node AiPaddle |

## Plan

- [x] Tạo `PaddleBase.ts`
- [x] Tạo `AiPaddle.ts`
- [x] Refactor `PlayerPaddle`, `BallController`, `GameManager`
- [x] Scene: node `AiPaddle` + wire refs
- [x] Cập nhật docs
- [x] Human: Play mode — `/da-kiem-tra-xong F002`

## Liên kết

- GDD: [00-GDD.md](../00-GDD.md)
- F001: [F001-core-gameplay.md](F001-core-gameplay.md)
