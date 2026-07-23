# Scenes & Prefabs

> Cập nhật file này mỗi khi thêm/sửa scene, prefab, hoặc gắn script mới.

## Luồng chuyển scene (hiện tại)

```
Menu → Game → (GameOver) → Menu | Chơi lại
```

---

## Scenes

| Scene | Path | Mô tả | Scripts gắn | Trạng thái |
|-------|------|-------|-------------|------------|
| Menu | `assets/scenes/Menu.scene` | Màn hình chính — title + nút Chơi | MenuController | done |
| Game | `assets/scenes/Game.scene` | Scene chính — sân, bóng, 2 vợt, HUD | GameManager, ScoreManager, InputHandler, BallController, PlayerPaddle, AiPaddle, HudController | done |

### Menu.scene — cấu trúc node

```
Menu (Scene)
└── Canvas (1280×720)
    ├── TitleLabel     [Ping Pong]
    └── PlayButton     [Chơi → load Game]
        └── Label
```

### Wire reference (Menu)

| Component | Property | Target |
|-----------|----------|--------|
| `MenuController` | `playButton` | `Canvas/PlayButton` → Button |

### Game.scene — cấu trúc node (hiện tại)

```
Game (Scene)
└── Canvas (1280×720, touchArea cho InputHandler)
    ├── Camera
    ├── PlayerPaddle   [UITransform 20×120, Sprite default_sprite, PlayerPaddle]
    ├── AiPaddle       [UITransform 20×120, Sprite default_sprite đỏ, AiPaddle]
    ├── Ball           [UITransform 58×62, Sprite resources/Ball.png, BallController]
    ├── ServeAnchor      [player serve, x:-200]
    ├── AiServeAnchor    [AI serve, x:200]
    ├── Managers       [InputHandler, GameManager, ScoreManager]
    └── HUD            [HudController]
        ├── PlayerScoreLabel
        ├── AiScoreLabel
        ├── MessageLabel
        ├── RestartButton   [ẩn; hiện khi GameOver]
        └── MenuButton      [ẩn; hiện khi GameOver → Menu]
```

### Wire reference (Inspector)

| Component | Property | Target |
|-----------|----------|--------|
| `GameManager` | `ballController` | `Canvas/Ball` → BallController |
| `GameManager` | `scoreManager` | `Canvas/Managers` → ScoreManager |
| `GameManager` | `playerServeAnchor` | `Canvas/ServeAnchor` |
| `GameManager` | `aiServeAnchor` | `Canvas/AiServeAnchor` |
| `GameManager` | `playerPaddle` | `Canvas/PlayerPaddle` → PlayerPaddle |
| `GameManager` | `aiPaddle` | `Canvas/AiPaddle` → AiPaddle |
| `InputHandler` | `playerPaddle` | `Canvas/PlayerPaddle` → PlayerPaddle |
| `InputHandler` | `touchArea` | `Canvas` |
| `BallController` | `playerPaddle` | `Canvas/PlayerPaddle` → PlayerPaddle |
| `BallController` | `aiPaddle` | `Canvas/AiPaddle` → AiPaddle |
| `AiPaddle` | `ballNode` | `Canvas/Ball` |
| `HudController` | `playerScoreLabel` | `HUD/PlayerScoreLabel` → Label |
| `HudController` | `aiScoreLabel` | `HUD/AiScoreLabel` → Label |
| `HudController` | `messageLabel` | `HUD/MessageLabel` → Label |
| `HudController` | `scoreManager` | `Canvas/Managers` → ScoreManager |
| `HudController` | `gameManager` | `Canvas/Managers` → GameManager |
| `HudController` | `restartButton` | `HUD/RestartButton` → Button |
| `HudController` | `menuButton` | `HUD/MenuButton` → Button |

---

## Prefabs

| Prefab | Path | Dùng trong | Scripts | Trạng thái |
|--------|------|------------|---------|------------|
| *(chưa có)* | — | — | — | — |

---

## Checklist wire reference (khi thêm component)

- [x] Mọi `@property` bắt buộc đã gán trong Inspector
- [x] Prefab không broken (mở prefab mode không báo missing)
- [x] Scene `Game` save sau khi gắn script
- [x] Play mode không throw trong `onLoad()` validation
- [x] Play mode: gameplay khớp acceptance criteria F003
