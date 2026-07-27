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
└── Canvas (1280×720, Widget + MenuController)
    ├── Camera
    ├── BG (scale 2×)                    [nền + khung sân — sprite Goal atlas]
    │   ├── base                         [Sprite nền]
    │   ├── Frame                        [4 góc: frame_0002..0005]
    │   ├── Decor                        [trang trí — Flower + frame_* (bỏ qua chi tiết)]
    │   └── Boder                        [tường trên/dưới + biên trái/phải]
    ├── Title
    │   ├── bg                           [Sprite]
    │   ├── Label                        [Ping Pong]
    │   └── frame_0022                   [Sprite trang trí]
    ├── DifficultyLabel                  [*(ẩn)* — mặc định AI Vừa]
    ├── PlayButton                       [Chơi → load Game]
    │   ├── frame_0012 / frame_0015
    │   └── Label
    ├── MediumButton *(ẩn)*
    │   └── Label
    ├── HardButton *(ẩn)*
    │   └── Label
    ├── EasyButton *(ẩn)*
    │   └── Label
    ├── HelpButton                       [Hướng dẫn → spawn TutorialPopup]
    │   ├── frame_0012 / frame_0018 / frame_0021
    │   └── Label
    ├── SettingButton                    [UI trang trí — chưa wire script]
    │   ├── frame_0012 / frame_0018 / frame_0021
    │   └── Label
    └── PopupRoot                        [popup spawn runtime]
```

Popup spawn runtime: `UiPopup` tự tìm `Canvas/PopupRoot` (fallback `Canvas`).

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
    ├── BG (scale 2×)                    [nền + khung sân — render dưới gameplay]
    │   ├── base                         [Sprite nền]
    │   ├── Frame                        [4 góc: frame_0002..0005]
    │   ├── Decor                        [trang trí — Flower + frame_* (bỏ qua chi tiết)]
    │   └── Boder                        [tường trên/dưới + biên trái/phải]
    ├── PlayerPaddle                     [PlayerPaddle]
    ├── Managers                         [InputHandler, GameManager, ScoreManager, AudioManager]
    ├── ServeAnchor
    ├── Ball                             [BallController, Animation]
    ├── AiPaddle                         [AiPaddle]
    ├── HUD                              [HudController]
    │   ├── PlayerScoreLabel             [Label — điểm người chơi]
    │   ├── AiScoreLabel                 [Label — điểm AI]
    │   ├── AiScore                      [Sprite khung điểm AI]
    │   └── PlayerScore                  [Sprite khung điểm người chơi]
    ├── AiServeAnchor
    ├── hand                             [Animation clip `hand` — intro từ Menu]
    └── PopupRoot                        [popup spawn runtime]
```

> **Layout gameplay:** Player phải (x≈450), AI trái (x≈-450). Biên bóng X ±490, Y ±240. Ghi điểm chỉ qua khung goal Y ±160 ở hai biên; ngoài khung bóng nảy cạnh.

Popup spawn runtime: `UiPopup` tự tìm `Canvas/PopupRoot` (fallback `Canvas`).

### Wire reference (Inspector)

| Component | Property | Target |
|-----------|----------|--------|
| `GameManager` | `ballController` | `Canvas/Ball` → BallController |
| `GameManager` | `scoreManager` | `Canvas/Managers` → ScoreManager |
| `GameManager` | `playerServeAnchor` | `Canvas/ServeAnchor` |
| `GameManager` | `aiServeAnchor` | `Canvas/AiServeAnchor` |
| `GameManager` | `playerPaddle` | `Canvas/PlayerPaddle` → PlayerPaddle |
| `GameManager` | `aiPaddle` | `Canvas/AiPaddle` → AiPaddle |
| `GameManager` | `handNode` | `Canvas/hand` |
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
| `GameCanvasLayout` | *(Canvas)* | Biên bóng cố định, vị trí vợt/serve — player phải, AI trái |
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
