# Game Design Document — PingPong

> Cocos Creator 3.8.7 · TypeScript · 2D

## Tổng quan

Game **Ping Pong** (bóng bàn) 2D: người chơi điều khiển vợt, đánh bóng qua lại với đối thủ (AI hoặc người chơi thứ hai). Thắng khi đối thủ không đỡ được bóng hoặc đạt điểm mục tiêu trước.

## Core loop

```
Serve → Rally (đánh qua lại) → Ghi điểm → Reset vị trí bóng → Serve
```

1. Giao bóng từ điểm giữa (serve)
2. Hai bên đánh bóng qua lại (rally)
3. Bóng chạm biên trên/dưới hoặc khối 2 bên người chơi / AI nảy lại.
4. Bóng vượt qua vợt đối phương đi qua vùng biên nhỏ trái/phải → ghi điểm
5. Reset bóng về vị trí serve, chuyển quyền giao bóng (luân phiên hoặc theo luật đã chọn)

## Mechanics chính

| Mechanic | Mô tả | Ghi chú |
|----------|-------|---------|
| Di chuyển vợt | Player kéo/thả hoặc phím | Trục dọc, giới hạn trong sân |
| Vật lý bóng | Phản xạ góc theo điểm chạm vợt | Tốc độ tăng dần theo rally (tùy chọn) |
| Ghi điểm | Bóng ra ngoài biên hoặc không đỡ được | Điểm cho bên còn lại |
| Serve | Bóng xuất phát từ phía người giao | Có thể random hướng nhẹ |
| AI (phase sau) | Vợt AI theo dõi vị trí bóng | Độ khó điều chỉnh tốc độ/phản xạ |

## Mục tiêu game

- **Session ngắn:** Một trận ~2–5 phút (ví dụ: ai đạt 5 điểm trước)
- **Cảm giác:** Phản hồi nhanh, điều khiển đơn giản, phù hợp mobile/playable/web
- **Mở rộng (sau MVP):** Menu, chọn độ khó, âm thanh, hiệu ứng

## Phạm vi MVP

| Có trong MVP | Ngoài MVP (phase sau) |
|--------------|------------------------|
| 1 scene chơi (`Game`) | Menu / Settings |
| AI cơ bản | Multiplayer local |
| Ghi điểm, thắng/thua | Power-up, skin |
| Bóng + 2 vợt + biên sân | Leaderboard |

## Tham chiếu kỹ thuật

- Module & trạng thái: [01-MODULES.md](01-MODULES.md)
- Scene & prefab: [02-SCENES.md](02-SCENES.md)
- Kiến trúc code: [03-ARCHITECTURE.md](03-ARCHITECTURE.md)
- Luồng làm việc: [WORKFLOW.md](WORKFLOW.md)
