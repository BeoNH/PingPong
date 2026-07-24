# F009 — UI sân: tường ngăn & layout ngang

| Trường | Giá trị |
|--------|---------|
| **ID** | F009 |
| **Trạng thái** | `done` |
| **Module** | M08 ([01-MODULES.md](../01-MODULES.md)) |
| **Ngày tạo** | 2026-07-24 |

---

## Mục tiêu

Màn chơi có nền sân, tường trên/dưới và vạch ngăn giữa; tự co giãn theo mọi tỉ lệ **khung ngang** — ưu tiên lấp đầy màn hình, không bande đen trên/dưới hoặc thiếu hai bên.

## Phạm vi

### Trong phạm vi

- Node `Playfield`: nền, tường trên/dưới, vạch giữa
- `GameCanvasLayout` (gắn **Canvas**): policy ngang + đồng bộ biên sân với Ball/Paddle — tự tìm node con, không wire Inspector
- Asset sprite đơn giản trong `assets/resources/ui/`

### Ngoài phạm vi

- Menu scene redesign
- Prefab hóa Playfield
- Portrait / dọc màn hình

## Acceptance criteria

- [x] Play mode: thấy nền sân + tường + vạch giữa
- [x] Đổi kích thước preview ngang — sân lấp canvas, gameplay vẫn đúng biên
- [x] Bóng/vợt phản xạ đúng tường trên/dưới; ghi điểm ở biên trái/phải
- [x] `npm run lint` pass

## Thiết kế kỹ thuật

### File tạo / sửa

| File | Hành động | Ghi chú |
|------|-----------|---------|
| `GameCanvasLayout.ts` | create | Gắn Canvas — layout + resolution policy |
| `BallController.ts` | modify | `applyCourtBounds()` |
| `PaddleBase.ts` | modify | `applyCourtBounds()` |
| `assets/resources/ui/*.png` | create | Nền, tường, vạch |
| `assets/scenes/Game.scene` | modify | Playfield nodes + wire |

### Scene / Prefab (Editor / MCP)

- `Canvas/Playfield` — Background, TopWall, BottomWall, CenterDivider
- `Canvas` — gắn `GameCanvasLayout` (4 số config: wall, divider, inset serve/paddle)

## Plan

- [ ] Spec + MODULES
- [ ] Script CourtLayoutController + bounds API
- [ ] Asset + scene Playfield
- [ ] Sync docs + lint
- [x] Human: Play mode + `/review-done F009`

## Liên kết

- GDD: [00-GDD.md](../00-GDD.md)
