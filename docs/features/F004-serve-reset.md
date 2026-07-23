# F004 — Reset vị trí & serve sau mỗi điểm

| Trường | Giá trị |
|--------|---------|
| **ID** | F004 |
| **Trạng thái** | `done` |
| **Module** | M01 ([01-MODULES.md](../01-MODULES.md)) |
| **Ngày tạo** | 2026-07-23 |

---

## Mục tiêu

Sau mỗi điểm: reset vợt + bóng về giữa; giao bóng từ phía người ghi điểm, hướng về bên **không** ghi điểm.

## Acceptance criteria

- [x] Ghi điểm → cả hai vợt về y=0, bóng tại anchor phía giao
- [x] Player ghi điểm → bóng giao từ trái, bay sang phải (AI)
- [x] AI ghi điểm → bóng giao từ phải, bay sang trái (player)
- [x] `npm run lint` pass

## Plan

- [x] `PaddleBase.resetToCenter()`, `AiPaddle.resetForServe()`
- [x] `GameManager` — 2 serve anchor, sửa hướng serve, reset mỗi điểm
- [x] Scene: `AiServeAnchor` (x:200)
- [x] Human: `/review-done F004`
