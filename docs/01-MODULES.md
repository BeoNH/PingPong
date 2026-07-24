# Modules & hệ thống

Danh sách module logic của dự án PingPong. Cập nhật trạng thái mỗi khi bắt đầu hoặc hoàn thành tính năng (xem [WORKFLOW.md](WORKFLOW.md)).

**Trạng thái:** `planned` · `doing` · `done`

| ID | Module | Mô tả | Phụ thuộc | Trạng thái | Feature spec |
|----|--------|-------|-----------|------------|--------------|
| M01 | **Core / GameManager** | Điều phối trạng thái trận (serve, rally, score, end, restart) | — | done | F001, F002, F003, F005 |
| M02 | **Ball** | Di chuyển bóng, va chạm tường/vợt, reset serve | M01 | done | F001, F002 |
| M03 | **Paddle (Player)** | Input người chơi, giới hạn biên sân | — | done | F001 |
| M04 | **Paddle (AI)** | Logic đuổi bóng, độ khó | M02, M03 | done | F002, F008 |
| M05 | **Score** | Điểm số, điều kiện thắng, reset, UI hiển thị | M01 | done | F003, F005 |
| M06 | **Input** | Touch / keyboard abstraction | — | done | F001 |
| M07 | **Audio** | SFX va chạm, ghi điểm | M02, M05 | planned | F007 *(chờ asset)* |
| M08 | **UI / HUD** | Scoreboard, sân/tường ngăn, popup Game Over (tween), layout Canvas | M05 | done | F003, F005, F006, F009, F010 |
| M09 | **Menu** | Scene menu, chọn độ khó, popup hướng dẫn, chuyển scene Menu ↔ Game | — | done | F006, F008, F010 |

## Quy ước đặt tên script (dự kiến)

| Module | File dự kiến | Loại |
|--------|--------------|------|
| M01 | `assets/scripts/GameManager.ts` | Component (singleton scene) |
| M02 | `assets/scripts/BallController.ts` | Component |
| M03 | `assets/scripts/PlayerPaddle.ts` | Component |
| M04 | `assets/scripts/AiDifficulty.ts` | Hằng preset + state độ khó |
| M04 | `assets/scripts/AiPaddle.ts` | Component |
| M05 | `assets/scripts/ScoreManager.ts` | Component |
| M06 | `assets/scripts/InputHandler.ts` | Component / util |
| M07 | `assets/scripts/AudioManager.ts` | Component |
| M08 | `assets/scripts/HudController.ts` | Component |
| M08 | `assets/scripts/popups/UiPopup.ts` | Component base popup (tween, PopupRoot) |
| M08 | `assets/scripts/popups/GameOverPopup.ts` | Component con — Game Over |
| M08 | `assets/scripts/popups/TutorialPopup.ts` | Component con — hướng dẫn Menu |
| M08 | `assets/scripts/GameCanvasLayout.ts` | Component (gắn Canvas) |
| M09 | `assets/scripts/MenuController.ts` | Component |

## EventBus (dự kiến)

Xem chi tiết event trong [03-ARCHITECTURE.md](03-ARCHITECTURE.md).

| Event | Publisher | Subscriber |
|-------|-----------|------------|
| `paddle-hit` | BallController | AudioManager |
| `score-changed` | ScoreManager | HudController, AudioManager |
| `ball-out` | BallController | GameManager, ScoreManager (F003) |
| `match-ended` | GameManager | HudController, AudioManager |
