# Changelog

Mỗi lần thêm/sửa/xóa tính năng: **một dòng** theo format:

```
YYYY-MM-DD | Fxxx | <add|change|fix|remove>: <mô tả ngắn> | <file hoặc module chính>
```

Không ghi chi tiết implementation — chi tiết nằm trong spec `docs/features/` và commit git.

---

## Lịch sử

| Ngày | Feature | Thay đổi | File / module |
|------|---------|----------|---------------|
| 2026-07-28 | Settings | change: ScreenShake dao động sin giảm dần — mượt hơn, va chạm liên tiếp refresh | ScreenShake.ts |
| 2026-07-28 | Settings | add: SettingsPopup + ToggleSwitch + localStorage sound/effect + ScreenShake | SettingsPopup.ts, ToggleSwitch.ts, ScreenShake.ts, SettingsService.ts, MenuController.ts, BallController.ts, AudioManager.ts |
| 2026-07-28 | F003 | fix: Goal tween chạy ngay + đưa goal lên trên — ổn định bàn đầu | GoalCelebration.ts |
| 2026-07-28 | F003 | fix: GoalCelebration timeout + tween ổn định — tránh đơ sau ghi bàn | GoalCelebration.ts, GameManager.ts |
| 2026-07-28 | F003 | add: Effect GOAL scale khi ghi bàn — chờ xong mới serve tiếp | GoalCelebration.ts, GameManager.ts |
| 2026-07-28 | F010 | change: GameOverPopup dùng ảnh win/lose thay Label | GameOverPopup.ts |
| 2026-07-28 | F001 | change: Effect khi nảy tường; cạnh trên/dưới vợt chỉ đẩy ra, không phản xạ | BallController.ts |
| 2026-07-28 | F001 | fix: Khóa va chạm vợt + effect chỉ mặt trước — tránh spam cạnh trên/dưới | BallController.ts |
| 2026-07-28 | F001 | fix: Effect chạm spawn cùng parent/layer bóng; tốc độ clip lăn theo vận tốc | BallController.ts |
| 2026-07-28 | F001 | add: VFX anim trong BallController + PaddleBase (bóng/vợt/effect) | BallController.ts, PaddleBase.ts |
| 2026-07-28 | F003 | change: Điểm HUD dùng `SpriteScoreDisplay` (sprite 0–9), bỏ Label | SpriteScoreDisplay.ts, HudController.ts |
| 2026-07-27 | F001 | change: Nới biên sân ngang COURT_BOUNDS ±560 (bóng bay thêm trước khi ghi điểm) | GameType.ts |
| 2026-07-27 | F004 | change: Không reset vị trí vợt player sau mỗi điểm — chỉ lúc bắt đầu/restart trận | GameManager.ts |
| 2026-07-27 | — | fix: TS strict — bỏ `as const` mutable fields; dọn API/biên thừa | GameType, BallController, GameCanvasLayout |
| 2026-07-27 | F001 | change: Player phải / AI trái; biên bóng ±490×±240; goal Y ±160 nảy cạnh | BallController, GameCanvasLayout, AiPaddle, GameManager |
| 2026-07-27 | — | change: Cập nhật node tree Game/Menu — `Playfield` → `BG`, thêm PopupRoot & HUD score sprite | docs/02-SCENES.md |
| 2026-07-24 | F008 | change: Tạm ẩn UI chọn độ khó Menu; mặc định AI Vừa | MenuController.ts, Menu.scene |
| 2026-07-24 | F010 | change: Xóa HUD legacy (MessageLabel, Restart/MenuButton); popup chỉ prefab | Game.scene |
| 2026-07-24 | F010 | change: Human xác nhận Play mode / review | docs/features/F010-*.md |
| 2026-07-24 | F010 | change: Popup prefab + UiPopup base + GameOverPopup/TutorialPopup con | UiPopup.ts, prefabs/ |
| 2026-07-24 | F009 | change: Gộp CourtLayoutController → GameCanvasLayout trên Canvas | GameCanvasLayout.ts |
| 2026-07-24 | F009 | add: UI sân (tường, vạch giữa) + layout ngang adaptive | GameCanvasLayout, Game.scene |
| 2026-07-24 | F008 | fix: Delay serveLaunchDelay trước launch — bóng hiện tĩnh tại điểm giao | GameManager.ts |
| 2026-07-24 | F007 | change: Tạm dừng — chờ file audio (code skeleton giữ) | docs/features/F007-*.md |
| 2026-07-23 | F006 | change: Human xác nhận Play mode / review | docs/features/F006-*.md |
| 2026-07-23 | F006 | fix: Menu scene thêm Camera + wire Canvas (UI hiển thị) | Menu.scene |
| 2026-07-23 | F005 | change: Human xác nhận Play mode / review | docs/features/F005-*.md |
| 2026-07-23 | F005 | add: Chơi lại sau GameOver (restartMatch, RestartButton) | GameManager.ts, HudController.ts |
| 2026-07-23 | F004 | change: Human xác nhận Play mode / review | docs/features/F004-*.md |
| 2026-07-23 | — | change: Ball node dùng sprite `resources/Ball.png` | Game.scene |
| 2026-07-23 | F004 | fix: Wire GameManager refs (playerPaddle, aiPaddle, serve anchors) | Game.scene |
| 2026-07-23 | F004 | change: Reset vợt/bóng mỗi điểm, serve về bên không ghi điểm | GameManager.ts |
| 2026-07-23 | F002 | change: Human xác nhận Play mode / review | docs/features/F002-*.md |
| 2026-07-23 | F003 | add: ScoreManager, HudController, events score/match | ScoreManager.ts, HudController.ts |
| 2026-07-23 | F003 | change: GameManager delay giữa điểm + GameOver | GameManager.ts |
| 2026-07-23 | F003 | add: Scene HUD labels + wire refs | Game.scene |
| 2026-07-23 | F001 | change: Human xác nhận Play mode / review | docs/features/F001-*.md |
| 2026-07-23 | F002 | add: AiPaddle + PaddleBase, ball-out, GameManager reset serve | AiPaddle.ts, BallController.ts |
| 2026-07-23 | F002 | add: Scene node AiPaddle + wire refs | Game.scene |
| 2026-07-23 | — | add: Khởi tạo bộ tài liệu docs & workflow | docs/ |
| 2026-07-23 | — | add: Scene Game shell (Canvas + Camera) | Game.scene |
| 2026-07-23 | F001 | add: Core gameplay scripts (bóng, vợt, input, GameManager) | assets/scripts/ |
| 2026-07-23 | F001 | change: Gán default_sprite spriteFrame + sizeMode CUSTOM cho Ball/Paddle | Game.scene |
