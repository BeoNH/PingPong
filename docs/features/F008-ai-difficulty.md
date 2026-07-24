# F008 — Chọn độ khó AI (Menu)

| Trường | Giá trị |
|--------|---------|
| **ID** | F008 |
| **Trạng thái** | `done` |
| **Module** | M04, M09 ([01-MODULES.md](../01-MODULES.md)) |
| **Ngày tạo** | 2026-07-24 |

---

## Mục tiêu

Trước khi vào trận, người chơi chọn **Dễ / Vừa / Khó** trên Menu; AI áp preset tốc độ và phản xạ tương ứng.

## Phạm vi

### Trong phạm vi

- Preset độ khó trong `AiDifficulty.ts` (state chọn trước khi `loadScene`)
- Menu: 3 nút độ khó + label hiển thị lựa chọn
- `AiPaddle` áp preset trong `start()`
- Mặc định **Vừa** (= tham số hiện tại F002)

### Ngoài phạm vi

- Độ khó riêng cho từng trận trong Game (chỉ chọn từ Menu)
- Lưu preference qua session (localStorage)
- Audio (F007 pending)

## Yêu cầu chi tiết

1. Menu: bấm Dễ/Vừa/Khó → cập nhật label, giữ đến khi bấm Chơi
2. Vào Game: AI theo preset đã chọn
3. **Dễ:** AI chậm, phản xạ trễ, đuổi bóng sai — người mới thắng được
4. **Vừa:** cân bằng; player nhanh hơn AI (~500 vs 400)
5. **Khó:** AI mạnh nhưng vẫn **thua được** (tốc độ < player, sai lệch nhẹ)
6. Mọi mức: người chơi có thể đạt 5 điểm trước AI

## Acceptance criteria

- [x] Menu chọn từng mức, label đúng
- [x] Mỗi mức: player có thể thắng trận (đạt 5 điểm)
- [x] Chơi lại / quay Menu → lựa chọn mới áp dụng khi vào Game lại
- [x] `npm run lint` pass

> Sau khi test Play mode OK: `/da-kiem-tra-xong F008`

## Thiết kế kỹ thuật

### Preset (cân bằng — player moveSpeed ≈ 500)

| Mức | moveSpeed | reactionDelay | aimError | chaseThresholdX | Ý đồ |
|-----|-----------|---------------|----------|-----------------|------|
| Dễ | 240 | 0.24 | 90 | 220 | Thắng nhanh, AI hay hụt |
| Vừa | 320 | 0.14 | 60 | 140 | ~3–5 phút/trận |
| Khó | 380 | 0.09 | 40 | 90 | Khó hơn nhưng vẫn thắng được |

**Bóng:** mỗi va vợt thêm jitter góc ±`bounceAngleJitterDeg` (5°). **AI:** chỉ đuổi khi bóng bay về phía AI (`velocity.x > 0`).

### File tạo / sửa

| File | Hành động |
|------|-----------|
| `AiDifficulty.ts` | create — enum, preset, state |
| `AiPaddle.ts` | modify — `applyDifficulty()` |
| `MenuController.ts` | modify — 3 nút + label |
| `assets/scenes/Menu.scene` | modify — UI độ khó |

### Scene / Prefab (Human — Editor)

- Wire `easyButton`, `mediumButton`, `hardButton`, `difficultyLabel` nếu MCP ref lệch

## Plan

- [x] `AiDifficulty.ts` + `AiPaddle.applyDifficulty`
- [x] `MenuController` + scene Menu UI
- [x] Sync docs + lint
- [x] Human: Play mode test → review

## Liên kết

- F002: [F002-ai-paddle.md](F002-ai-paddle.md)
- F006: [F006-menu-scene.md](F006-menu-scene.md)
