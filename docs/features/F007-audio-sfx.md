# F007 — Audio SFX (va chạm, ghi điểm, kết thúc trận)

| Trường | Giá trị |
|--------|---------|
| **ID** | F007 |
| **Trạng thái** | `planned` *(tạm dừng — chờ file âm thanh; code skeleton đã có)* |
| **Module** | M07 ([01-MODULES.md](../01-MODULES.md)) |
| **Ngày tạo** | 2026-07-24 |

---

## Mục tiêu

Thêm phản hồi âm thanh cơ bản khi chơi: va chạm vợt, ghi điểm, kết thúc trận — lắng nghe event sẵn có, không đổi gameplay.

## Phạm vi

### Trong phạm vi

- `AudioManager` trên node `Managers` trong `Game.scene`
- Lắng nghe `paddle-hit`, `score-changed`, `match-ended`
- `@property AudioClip` tùy chọn — không throw nếu chưa gán clip (chờ Human thêm asset)
- Một `AudioSource` dùng `playOneShot`

### Ngoài phạm vi

- BGM / menu music
- Tạo hoặc import file `.mp3`/`.ogg` (Human)
- Wall bounce SFX
- Settings tắt/bật âm

## Yêu cầu chi tiết

1. Va chạm vợt (`paddle-hit`) → phát `paddleHitClip` nếu có
2. Ghi điểm (`score-changed`) → phát `scoreClip` nếu có
3. Game over (`match-ended`) → phát `matchEndClip` nếu có
4. Play mode không lỗi khi clip null

## Acceptance criteria

- [ ] Play Game: không throw trong `onLoad`/`onEnable` khi clip chưa gán
- [ ] Khi Human gán clip + wire refs → nghe SFX đúng 3 sự kiện
- [ ] Event đăng ký/hủy đúng lifecycle (`onEnable`/`onDisable`)
- [ ] `npm run lint` pass

> Sau khi test Play mode OK: `npm run review:done -- F007` hoặc chat `/da-kiem-tra-xong F007`

## Thiết kế kỹ thuật

### File tạo / sửa

| File | Hành động | Ghi chú |
|------|-----------|---------|
| `assets/scripts/AudioManager.ts` | create | Component lắng nghe event |
| `assets/scenes/Game.scene` | modify | Gắn AudioManager trên Managers |
| `docs/01-MODULES.md` | modify | M07 → done |
| `docs/02-SCENES.md` | modify | Wire AudioManager |
| `docs/03-ARCHITECTURE.md` | modify | Thêm AudioManager vào sơ đồ |

### Scene / Prefab (Human — Editor)

- Import SFX vào `assets/resources/audio/` (tùy chọn)
- Wire `@property`: `ballController`, `scoreManager`, `gameManager`, các `AudioClip`
- Gán clip vào `paddleHitClip`, `scoreClip`, `matchEndClip`

### Events / API

| Event | Publisher | Subscriber (mới) |
|-------|-----------|------------------|
| `paddle-hit` | BallController | AudioManager |
| `score-changed` | ScoreManager | AudioManager |
| `match-ended` | GameManager | AudioManager |

## Plan

- [x] Tạo `AudioManager.ts`
- [x] Gắn component trên `Managers`, wire refs bắt buộc (ball/score/game)
- [x] Sync docs
- [x] `npm run lint`
- [ ] Human: import clip + test nghe SFX → `/review-done F007`

## Ghi chú & rủi ro

- **Tạm dừng 2026-07-24:** chờ Human import clip; `AudioManager.ts` + wire scene đã có, chưa review Play mode có SFX
- Chưa có file audio trong repo — code phải chạy im lặng khi clip null
- `score-changed` cũng fire khi `resetScores()` — có thể nghe tiếng khi Chơi lại (chấp nhận MVP)

## Liên kết

- GDD: [00-GDD.md](../00-GDD.md)
- Architecture: [03-ARCHITECTURE.md](../03-ARCHITECTURE.md)
