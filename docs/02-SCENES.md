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
    ├── SettingButton                       [Cài đặt → spawn SettingPopup]
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
| `MenuController` | `settingButton` | `Canvas/SettingButton` → Button |
| `MenuController` | `tutorialPopupPrefab` | `assets/prefabs/TutorialPopup.prefab` |
| `MenuController` | `settingsPopupPrefab` | `assets/prefabs/SettingPopup.prefab` |

### Game.scene — cấu trúc node (hiện tại)

```
Game (Scene)
└── Canvas (Widget full screen + GameCanvasLayout + ScreenShake)
    ├── Camera
    ├── BG (scale 2×)                    [nền + khung sân — render dưới gameplay]
    │   ├── base                         [Sprite nền]
    │   ├── Frame                        [4 góc: frame_0002..0005]
    │   ├── Decor                        [trang trí — Flower + frame_* (bỏ qua chi tiết)]
    │   └── Boder                        [tường trên/dưới + biên trái/phải]
    ├── PlayerPaddle                     [PlayerPaddle, Animation clip `paddle`]
    ├── Managers                         [InputHandler, GameManager, ScoreManager, AudioManager]
    ├── ServeAnchor
    ├── Ball                             [BallController, Animation clip `ball`]
    ├── AiPaddle                         [AiPaddle, Animation clip `paddle`]
    ├── effect                           [template — inactive, clip `effect_0`]
    ├── HUD                              [HudController]
    │   ├── PlayerScore                  [SpriteScoreDisplay + Sprite nền]
    │   ├── AiScore                      [SpriteScoreDisplay + Sprite nền]
    │   ├── PlayerScoreLabel             *(ẩn — legacy Label, có thể xóa)*
    │   └── AiScoreLabel                 *(ẩn — legacy Label, có thể xóa)*
    ├── AiServeAnchor
    ├── hand                             [Animation clip `hand` — intro từ Menu]
    ├── goal                             [GoalCelebration — ẩn, sprite GOAL khi ghi bàn]
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
| `GameManager` | `goalCelebration` | `Canvas/goal` → GoalCelebration |
| `InputHandler` | `playerPaddle` | `Canvas/PlayerPaddle` → PlayerPaddle |
| `InputHandler` | `touchArea` | `Canvas` |
| `BallController` | `playerPaddle` | `Canvas/PlayerPaddle` → PlayerPaddle |
| `BallController` | `aiPaddle` | `Canvas/AiPaddle` → AiPaddle |
| `BallController` | `effectTemplate` | `Canvas/effect` |
| `BallController` | `screenShake` | `Canvas` → ScreenShake *(tùy chọn — auto-resolve)* |
| `AiPaddle` | `ballNode` | `Canvas/Ball` |
| `HudController` | `playerScoreDisplay` | `HUD/PlayerScore` → SpriteScoreDisplay |
| `HudController` | `aiScoreDisplay` | `HUD/AiScore` → SpriteScoreDisplay |
| `HudController` | `scoreManager` | `Canvas/Managers` → ScoreManager |
| `HudController` | `gameManager` | `Canvas/Managers` → GameManager |
| `HudController` | `gameOverPopupPrefab` | `assets/prefabs/GameOverPopup.prefab` |
| `SpriteScoreDisplay` *(trên PlayerScore)* | `digitFrames` | 10 SpriteFrame số 0→9 từ atlas `Goal` |
| `SpriteScoreDisplay` *(trên AiScore)* | `digitFrames` | 10 SpriteFrame số 0→9 từ atlas `Goal` |
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
| `GameOverPopup` | `winImageNode` | `Panel/win` |
| `GameOverPopup` | `loseImageNode` | `Panel/lose` |
| TutorialPopup | `assets/prefabs/TutorialPopup.prefab` | Menu (spawn runtime) | TutorialPopup extends UiPopup | done |
| SettingPopup | `assets/prefabs/SettingPopup.prefab` | Menu (spawn runtime) | SettingsPopup extends UiPopup, ToggleSwitch ×2 | done |

### SettingPopup.prefab — cấu trúc node

```
SettingPopup (SettingsPopup + UiPopup)
├── Overlay                          [bg — UiPopup.bg]
└── Panel                            [UiPopup.container]
    ├── TitleBox / TitleLabel
    ├── Sound
    │   └── button                   [ToggleSwitch — on/off con]
    │       ├── off
    │       └── on
    ├── Effect
    │   └── button                   [ToggleSwitch — on/off con]
    │       ├── off
    │       └── on
    └── CloseButton                  [Button]
```

### Wire reference (SettingPopup prefab)

| Component | Property | Target |
|-----------|----------|--------|
| `SettingsPopup` | `bg` | `Overlay` |
| `SettingsPopup` | `container` | `Panel` |
| `SettingsPopup` | `soundToggle` | `Panel/Sound/button` → ToggleSwitch |
| `SettingsPopup` | `effectToggle` | `Panel/Effect/button` → ToggleSwitch |
| `SettingsPopup` | `closeButton` | `Panel/CloseButton` → Button |
| `ToggleSwitch` *(Sound)* | `onNode` / `offNode` | `button/on`, `button/off` |
| `ToggleSwitch` *(Effect)* | `onNode` / `offNode` | `button/on`, `button/off` |
| `ToggleSwitch` | `offPositionX` / `onPositionX` | `-14` / `14` *(chỉnh theo track)* |

---

## Checklist wire reference (khi thêm component)

- [x] Mọi `@property` bắt buộc đã gán trong Inspector
- [x] Prefab không broken (mở prefab mode không báo missing)
- [x] Scene `Game` save sau khi gắn script
- [x] Play mode không throw trong `onLoad()` validation
- [x] Play mode: gameplay khớp acceptance criteria F003
