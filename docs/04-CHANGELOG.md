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
