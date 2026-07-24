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
| Menu | `assets/scenes/Menu.scene` | Menu — chọn độ khó, hướng dẫn, Chơi | MenuController | done |
| Game | `assets/scenes/Game.scene` | Scene chính — sân, bóng, 2 vợt, HUD + popup Game Over | GameManager, ScoreManager, InputHandler, AudioManager*, BallController, PlayerPaddle, AiPaddle, HudController, GameCanvasLayout | done |

\* `AudioManager` có sẵn (F007 planned — chờ clip)

### Menu.scene — cấu trúc node

```
Menu (Scene)
└── Canvas (1280×720)
    ├── TitleLabel       [Ping Pong]
    ├── PlayButton       [Chơi → load Game]
    │   └── Label
    ├── HelpButton       [Hướng dẫn → spawn TutorialPopup prefab]
    │   └── Label
    ├── *(ẩn)* EasyButton / MediumButton / HardButton / DifficultyLabel — mặc định AI Vừa
```

Popup spawn runtime: `instantiate` prefab → gắn dưới `Canvas` (hoặc `PopupRoot` nếu có).

### Wire reference (Menu)

| Component | Property | Target |
|-----------|----------|--------|
| `MenuController` | `playButton` | `Canvas/PlayButton` → Button |
| `MenuController` | `easyButton` | `Canvas/EasyButton` → Button |
| `MenuController` | `mediumButton` | `Canvas/MediumButton` → Button |
| `MenuController` | `hardButton` | `Canvas/HardButton` → Button |
| `MenuController` | `difficultyLabel` | `Canvas/DifficultyLabel` → Label |
| `MenuController` | `helpButton` | `Canvas/HelpButton` → Button |
| `MenuController` | `tutorialPopupPrefab` | `assets/prefabs/TutorialPopup.prefab` |

### Game.scene — cấu trúc node (hiện tại)

```
Game (Scene)
└── Canvas (Widget full screen + GameCanvasLayout)
    ├── Camera
    ├── Playfield          [nền + tường — render dưới gameplay]
    │   ├── Background
    │   ├── TopWall
    │   ├── CenterDivider
    │   └── BottomWall
    ├── PlayerPaddle
    ├── Managers           [InputHandler, GameManager, ScoreManager, AudioManager]
    ├── ServeAnchor
    ├── Ball
    ├── AiPaddle
    ├── HUD                [HudController]
    │   ├── PlayerScoreLabel
    │   └── AiScoreLabel
    └── AiServeAnchor
```

Popup spawn runtime: `instantiate` prefab → gắn dưới `Canvas` (hoặc `PopupRoot` nếu có).

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
| `HudController` | `scoreManager` | `Canvas/Managers` → ScoreManager |
| `HudController` | `gameManager` | `Canvas/Managers` → GameManager |
| `HudController` | `gameOverPopupPrefab` | `assets/prefabs/GameOverPopup.prefab` |
| `GameCanvasLayout` | *(Canvas)* | Tự tìm `Playfield/*`, `Ball`, paddles, serve anchors — chỉ config số trên Inspector |
| `AudioManager` | `ballController` | `Canvas/Ball` → BallController |
| `AudioManager` | `scoreManager` | `Canvas/Managers` → ScoreManager |
| `AudioManager` | `gameManager` | `Canvas/Managers` → GameManager |
| `AudioManager` | `paddleHitClip` / `scoreClip` / `matchEndClip` | *(Human)* import clip vào Inspector |

---

## Prefabs

| Prefab | Path | Dùng trong | Scripts | Trạng thái |
|--------|------|------------|---------|------------|
| GameOverPopup | `assets/prefabs/GameOverPopup.prefab` | Game (spawn runtime) | GameOverPopup extends UiPopup | done |
| TutorialPopup | `assets/prefabs/TutorialPopup.prefab` | Menu (spawn runtime) | TutorialPopup extends UiPopup | done |

---

## Checklist wire reference (khi thêm component)

- [x] Mọi `@property` bắt buộc đã gán trong Inspector
- [x] Prefab không broken (mở prefab mode không báo missing)
- [x] Scene `Game` save sau khi gắn script
- [x] Play mode không throw trong `onLoad()` validation
- [x] Play mode: gameplay khớp acceptance criteria F003
