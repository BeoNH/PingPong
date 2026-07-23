# F001 — Core gameplay (bóng + vợt + va chạm cơ bản)

| Trường | Giá trị |
|--------|---------|
| **ID** | F001 |
| **Trạng thái** | `done` |
| **Module** | M01, M02, M03 ([01-MODULES.md](../01-MODULES.md)) |
| **Người tạo** | — |
| **Ngày tạo** | 2026-07-23 |

---

## Mục tiêu

Có thể chơi được vòng rally cơ bản: bóng di chuyển, player điều khiển vợt, va chạm tường trên/dưới và vợt player; chưa cần AI hoặc ghi điểm đầy đủ.

## Phạm vi

### Trong phạm vi

- Bóng di chuyển liên tục, phản xạ khi chạm biên trên/dưới
- Vợt player di chuyển dọc (touch hoặc phím W/S hoặc mũi tên)
- Va chạm vợt → đổi hướng bóng (góc phụ thuộc điểm chạm trên vợt)
- `GameManager` state tối thiểu: `Serving` → `Playing`

### Ngoài phạm vi

- AI vợt (F002 hoặc module M04)
- Ghi điểm & UI (M05, M08)
- Âm thanh (M07)

## Yêu cầu chi tiết

1. Bóng không thoát khỏi biên trái/phải theo hướng gameplay (reset hoặc reflect tùy thiết kế sân)
2. Vợt giới hạn trong vùng sân (không ra ngoài Canvas)
3. Tốc độ bóng hằng số cho MVP (có thể config `@property`)
4. Validation: thiếu reference bắt buộc → throw trong `onLoad()`

## Acceptance criteria

- [x] Play mode: bóng bounce trên/dưới ổn định
- [x] Player di chuyển vợt mượt, không vượt biên
- [x] Đánh trúng vợt → bóng đổi hướng về phía đối diện
- [x] `npm run lint` pass
- [x] Docs MODULES / SCENES / CHANGELOG cập nhật

## Thiết kế kỹ thuật

### File tạo / sửa

| File | Hành động | Ghi chú |
|------|-----------|---------|
| `assets/scripts/GameManager.ts` | create | State machine tối thiểu |
| `assets/scripts/BallController.ts` | create | Move + collision |
| `assets/scripts/PlayerPaddle.ts` | create | Di chuyển vợt |
| `assets/scripts/InputHandler.ts` | create | Touch + keyboard |
| `assets/scripts/GameEvents.ts` | create | Event names + GameState enum |
| `assets/scripts/utils/ApplyDefaultSpriteFrame.ts` | create | Fallback sprite builtin nếu thiếu frame |
| `assets/scenes/Game.scene` | modify | Node Ball, Paddle, Managers |
| `docs/01-MODULES.md` | modify | M01–M03, M06 → doing/done |

### Scene / Prefab (Human — Editor)

- Tạo node `Ball` (Sprite + Collider2D + BallController)
- Tạo node `PlayerPaddle` (Sprite + Collider2D + PlayerPaddle)
- Tạo node `Managers` gắn GameManager, InputHandler
- Gán `@property` cross-reference trong Inspector

> **Agent đã dựng scene qua MCP.** Human: mở Play mode, xác nhận gameplay; gán sprite frame tùy chọn nếu muốn art riêng.

### Events / API

| Event / Method | Mô tả |
|----------------|-------|
| `paddle-hit` | BallController phát khi chạm vợt player |
| `GameManager.startRally()` | Chuyển Serving → Playing |

### Quyết định kỹ thuật

- **Custom move** (không dùng `RigidBody2D`) — kiểm soát góc phản xạ và tốc độ ổn định cho MVP
- Biên trái/phải **reflect** tạm (chưa ghi điểm) cho đến khi có AI (F002)

## Plan

- [x] Tạo `InputHandler.ts` — abstract input
- [x] Tạo `PlayerPaddle.ts` — di chuyển + giới hạn biên
- [x] Tạo `BallController.ts` — velocity, wall/paddle bounce
- [x] Tạo `GameManager.ts` — state + wire events
- [x] Agent: layout node trong `Game.scene`, gắn component cơ bản
- [x] Cập nhật `02-SCENES.md`, `03-ARCHITECTURE.md`, `04-CHANGELOG.md`
- [x] Human: Play mode — xác nhận acceptance criteria gameplay

## Ghi chú & rủi ro

- Agent **không** tự sửa file `.scene` JSON phức tạp nếu có thể tránh — ưu tiên script; Human wire trong Editor
- ~~Cần thống nhất dùng `RigidBody2D` + PhysicsSystem hay custom move trước khi implement~~ → **Đã chọn custom move**

## Liên kết

- GDD: [00-GDD.md](../00-GDD.md)
- Architecture: [03-ARCHITECTURE.md](../03-ARCHITECTURE.md)
