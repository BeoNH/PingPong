---
name: theone-cocos-standards
description: Áp dụng chuẩn phát triển Cocos Creator của TheOne Studio — pattern TypeScript, kiến trúc Component/EventDispatcher Cocos Creator 3.x, tối ưu playable ads. Dùng khi viết, sửa, review code TypeScript Cocos, triển khai playable, tối ưu performance/kích thước bundle, hoặc review thay đổi code.
---

# Chuẩn phát triển Cocos Creator — TheOne Studio

⚠️ **Cocos Creator 3.x (TypeScript 4.1+):** Mọi pattern và ví dụ tương thích phát triển playable ads trên Cocos Creator 3.x.

## Mục đích skill

Skill này áp dụng chuẩn phát triển Cocos Creator toàn diện của TheOne Studio với nguyên tắc **ƯU TIÊN CHẤT LƯỢNG CODE**:

**Ưu tiên 1: Chất lượng code & vệ sinh code** (QUAN TRỌNG NHẤT)
- TypeScript strict mode, cấu hình ESLint, access modifier (public/private/protected)
- Ném exception (không xử lý lỗi im lặng)
- `console.log` chỉ khi dev, xóa trước build production
- `readonly` cho field bất biến, `const` cho hằng số
- Không comment inline (dùng tên mô tả rõ)
- Xử lý lỗi đúng cách và type safety

**Ưu tiên 2: Pattern TypeScript hiện đại**
- Phương thức mảng (map/filter/reduce) thay vòng lặp thủ công
- Arrow function, destructuring, spread operator
- Optional chaining, nullish coalescing
- Type guard, utility type (Partial, Required, Readonly)
- Tính năng TypeScript hiện đại

**Ưu tiên 3: Kiến trúc Cocos Creator**
- Hệ Entity-Component (EC)
- Lifecycle: onLoad→start→onEnable→update→onDisable→onDestroy
- Pattern EventDispatcher cho custom event
- Hệ thống event Node (EventTouch, phím bàn phím)
- Quản lý tài nguyên và object pooling cho playable

**Ưu tiên 4: Performance playable ads**
- Gộp lệnh DrawCall (mục tiêu <10 DrawCall)
- Cấu hình Sprite atlas (bật auto-atlas)
- GPU skinning cho animation xương
- Không cấp phát bộ nhớ trong vòng `update()`
- Kích thước bundle <5MB (nén texture, minify code)

## Khi nào skill được kích hoạt

- Viết hoặc refactor code TypeScript Cocos Creator
- Triển khai tính năng playable ads
- Làm việc với lifecycle Component và event
- Tối ưu performance cho playable ads
- Review thay đổi code hoặc pull request
- Thiết lập kiến trúc dự án playable
- Giảm kích thước bundle hoặc số DrawCall

## Bảng tra cứu nhanh

### Bạn cần hỗ trợ gì?

| Ưu tiên | Nhiệm vụ | Tham chiếu |
|---------|----------|------------|
| **🔴 ƯU TIÊN 1: Chất lượng code (KIỂM TRA TRƯỚC)** | | |
| 1 | TypeScript strict mode, ESLint, access modifier | [Quality & Hygiene](references/language/quality-hygiene.md) ⭐ |
| 1 | Ném exception, xử lý lỗi đúng cách | [Quality & Hygiene](references/language/quality-hygiene.md) ⭐ |
| 1 | `console.log` (chỉ dev), xóa khi production | [Quality & Hygiene](references/language/quality-hygiene.md) ⭐ |
| 1 | readonly/const, không comment inline, tên mô tả | [Quality & Hygiene](references/language/quality-hygiene.md) ⭐ |
| **🟡 ƯU TIÊN 2: Pattern TypeScript hiện đại** | | |
| 2 | Phương thức mảng, arrow function, destructuring | [Modern TypeScript](references/language/modern-typescript.md) |
| 2 | Optional chaining, nullish coalescing | [Modern TypeScript](references/language/modern-typescript.md) |
| 2 | Type guard, utility type | [Modern TypeScript](references/language/modern-typescript.md) |
| **🟢 ƯU TIÊN 3: Kiến trúc Cocos** | | |
| 3 | Hệ Component, decorator `@property` | [Component System](references/framework/component-system.md) |
| 3 | Lifecycle (onLoad→start→update→onDestroy) | [Component System](references/framework/component-system.md) |
| 3 | EventDispatcher, event Node, cleanup | [Event Patterns](references/framework/event-patterns.md) |
| 3 | Load tài nguyên, pooling, quản lý bộ nhớ | [Playable Optimization](references/framework/playable-optimization.md) |
| **🔵 ƯU TIÊN 4: Performance & Review** | | |
| 4 | Gộp lệnh DrawCall, Sprite atlas, GPU skinning | [Playable Optimization](references/framework/playable-optimization.md) |
| 4 | Tối ưu vòng update, không cấp phát bộ nhớ | [Performance](references/language/performance.md) |
| 4 | Giảm kích thước bundle (mục tiêu <5MB) | [Size Optimization](references/framework/size-optimization.md) |
| 4 | Review kiến trúc (component, lifecycle, event) | [Architecture Review](references/review/architecture-review.md) |
| 4 | Review chất lượng TypeScript | [Quality Review](references/review/quality-review.md) |
| 4 | Review performance (DrawCall, cấp phát bộ nhớ) | [Performance Review](references/review/performance-review.md) |

## 🔴 QUAN TRỌNG: Quy tắc chất lượng code (KIỂM TRA TRƯỚC!)

### ⚠️ CHUẨN CHẤT LƯỢNG BẮT BUỘC

**LUÔN áp dụng các quy tắc sau TRƯỚC KHI viết bất kỳ code nào:**

1. **Bật TypeScript strict mode** — `"strict": true` trong `tsconfig.json`
2. **Dùng cấu hình ESLint** — bật rule `@typescript-eslint`
3. **Dùng access modifier** — public/private/protected trên mọi member
4. **Ném exception khi lỗi** — KHÔNG im lặng, KHÔNG trả `undefined` thay lỗi
5. **`console.log` chỉ khi dev** — Xóa mọi `console` trước build production
6. **Dùng `readonly` cho field bất biến** — Đánh dấu field không gán lại
7. **Dùng `const` cho hằng số** — Hằng số phải là `const`, không phải `let`
8. **Không comment inline** — Dùng tên mô tả; code tự giải thích
9. **Xử lý null/undefined đúng cách** — Dùng optional chaining và nullish coalescing
10. **Type safety** — Tránh type `any`, dùng type và interface phù hợp

**Ví dụ: Ưu tiên chất lượng trước**

```typescript
// ✅ XUẤT SẮC: Tuân thủ đủ quy tắc chất lượng
import { _decorator, Component, Node, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    // 3. Access modifier, 6. readonly cho field bất biến
    @property(Node)
    private readonly targetNode: Node | null = null;

    // 7. const cho hằng số
    private static readonly MAX_HEALTH: number = 100;
    private currentHealth: number = 100;

    // Lifecycle: onLoad → start → onEnable
    protected onLoad(): void {
        // 4. Ném exception khi lỗi
        if (!this.targetNode) {
            throw new Error('PlayerController: targetNode is not assigned');
        }

        // 9. Đăng ký event listener đúng cách
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    protected onDestroy(): void {
        // 9. Luôn cleanup event listener
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private onTouchStart(event: EventTouch): void {
        // 5. console.log chỉ khi dev (xóa khi production)
        if (CC_DEBUG) {
            console.log('Touch detected');
        }

        this.takeDamage(10);
    }

    // 8. Tên method mô tả (không cần comment inline)
    private takeDamage(amount: number): void {
        this.currentHealth -= amount;

        if (this.currentHealth <= 0) {
            this.handlePlayerDeath();
        }
    }

    private handlePlayerDeath(): void {
        // Logic khi chết
    }
}
```

## ⚠️ Quy tắc kiến trúc Cocos Creator (SAU chất lượng code)

### Cơ bản hệ Component

**Hệ Entity-Component (EC):**
- Component kế thừa class `Component`
- Dùng decorator `@ccclass` và `@property`
- Lifecycle: onLoad → start → onEnable → update → lateUpdate → onDisable → onDestroy

**Thứ tự thực thi:**
1. **onLoad()** — Khởi tạo Component, setup một lần
2. **start()** — Sau khi mọi Component đã onLoad, có thể tham chiếu Component khác
3. **onEnable()** — Khi Component/node được bật (có thể gọi nhiều lần)
4. **update(dt)** — Mỗi frame (dùng tiết kiệm với playable)
5. **lateUpdate(dt)** — Sau tất cả lệnh gọi `update()`
6. **onDisable()** — Khi Component/node bị tắt
7. **onDestroy()** — Cleanup, gỡ listener, giải phóng tài nguyên

**Quy tắc chung:**
- ✅ Khởi tạo trong `onLoad()`, tham chiếu Component khác trong `start()`
- ✅ Đăng ký event trong `onEnable()`, hủy trong `onDisable()`
- ✅ Luôn cleanup listener trong `onDestroy()`
- ✅ Tránh logic nặng trong `update()` (quan trọng với performance playable)
- ✅ Dùng `readonly` cho field `@property` không gán lại
- ✅ Ném exception khi thiếu reference bắt buộc

## Ví dụ ngắn

### 🔴 Ưu tiên chất lượng code

```typescript
// ✅ XUẤT SẮC: Tuân thủ quy tắc chất lượng
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    private readonly playerNode: Node | null = null;

    private static readonly MAX_SCORE: number = 1000;
    private currentScore: number = 0;

    protected onLoad(): void {
        // Ném exception khi thiếu reference bắt buộc
        if (!this.playerNode) {
            throw new Error('GameManager: playerNode is required');
        }

        if (CC_DEBUG) {
            console.log('GameManager initialized'); // Chỉ khi dev
        }
    }

    public addScore(points: number): void {
        if (points <= 0) {
            throw new Error('GameManager.addScore: points must be positive');
        }

        this.currentScore = Math.min(
            this.currentScore + points,
            GameManager.MAX_SCORE
        );
    }
}
```

### 🟡 Pattern TypeScript hiện đại

```typescript
// ✅ TỐT: Phương thức mảng thay vòng lặp thủ công
const activeEnemies = allEnemies.filter(e => e.isActive);
const enemyPositions = activeEnemies.map(e => e.node.position);

// ✅ TỐT: Optional chaining và nullish coalescing
const playerName = player?.name ?? 'Unknown';

// ✅ TỐT: Destructuring
const { x, y } = this.node.position;

// ✅ TỐT: Arrow function
this.enemies.forEach(enemy => enemy.takeDamage(10));

// ✅ TỐT: Type guard
function isPlayer(node: Node): node is PlayerNode {
    return node.getComponent(PlayerController) !== null;
}
```

### 🟢 Pattern Component Cocos Creator

```typescript
import { _decorator, Component, Node, EventTouch, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchHandler')
export class TouchHandler extends Component {
    @property(Node)
    private readonly targetNode: Node | null = null;

    private readonly tempVec3: Vec3 = new Vec3(); // Vector tái sử dụng

    // 1. onLoad: Khởi tạo Component
    protected onLoad(): void {
        if (!this.targetNode) {
            throw new Error('TouchHandler: targetNode is required');
        }
    }

    // 2. start: Tham chiếu Component khác (nếu cần)
    protected start(): void {
        // Có thể truy cập Component khác an toàn tại đây
    }

    // 3. onEnable: Đăng ký event listener
    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    // 4. onDisable: Hủy event listener
    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    // 5. onDestroy: Cleanup cuối cùng
    protected onDestroy(): void {
        // Giải phóng tài nguyên bổ sung
    }

    private onTouchStart(event: EventTouch): void {
        // Xử lý touch
    }

    private onTouchMove(event: EventTouch): void {
        // Tái sử dụng vector để tránh cấp phát bộ nhớ
        this.targetNode!.getPosition(this.tempVec3);
        this.tempVec3.y += 10;
        this.targetNode!.setPosition(this.tempVec3);
    }
}
```

### 🟢 Pattern Event Dispatcher

```typescript
import { _decorator, Component, EventTarget } from 'cc';
const { ccclass } = _decorator;

// Loại custom event
export enum GameEvent {
    SCORE_CHANGED = 'score_changed',
    LEVEL_COMPLETE = 'level_complete',
    PLAYER_DIED = 'player_died',
}

export interface ScoreChangedEvent {
    oldScore: number;
    newScore: number;
}

@ccclass('EventManager')
export class EventManager extends Component {
    private static instance: EventManager | null = null;
    private readonly eventTarget: EventTarget = new EventTarget();

    protected onLoad(): void {
        if (EventManager.instance) {
            throw new Error('EventManager: instance already exists');
        }
        EventManager.instance = this;
    }

    public static emit(event: GameEvent, data?: any): void {
        if (!EventManager.instance) {
            throw new Error('EventManager: instance not initialized');
        }
        EventManager.instance.eventTarget.emit(event, data);
    }

    public static on(event: GameEvent, callback: Function, target?: any): void {
        if (!EventManager.instance) {
            throw new Error('EventManager: instance not initialized');
        }
        EventManager.instance.eventTarget.on(event, callback, target);
    }

    public static off(event: GameEvent, callback: Function, target?: any): void {
        if (!EventManager.instance) {
            throw new Error('EventManager: instance not initialized');
        }
        EventManager.instance.eventTarget.off(event, callback, target);
    }
}

// Cách dùng trong Component
@ccclass('ScoreDisplay')
export class ScoreDisplay extends Component {
    protected onEnable(): void {
        EventManager.on(GameEvent.SCORE_CHANGED, this.onScoreChanged, this);
    }

    protected onDisable(): void {
        EventManager.off(GameEvent.SCORE_CHANGED, this.onScoreChanged, this);
    }

    private onScoreChanged(data: ScoreChangedEvent): void {
        console.log(`Score: ${data.oldScore} → ${data.newScore}`);
    }
}
```

### 🔵 Tối ưu performance playable

```typescript
import { _decorator, Component, Node, Sprite, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OptimizedSpriteManager')
export class OptimizedSpriteManager extends Component {
    // Dùng Sprite atlas để gộp lệnh DrawCall
    @property(SpriteAtlas)
    private readonly characterAtlas: SpriteAtlas | null = null;

    // Cấp phát trước mảng để tránh cấp phát trong update()
    private readonly tempNodes: Node[] = [];
    private frameCount: number = 0;

    protected onLoad(): void {
        if (!this.characterAtlas) {
            throw new Error('OptimizedSpriteManager: characterAtlas is required');
        }

        // Prewarm sprite frame từ atlas
        this.prewarmSpriteFrames();
    }

    private prewarmSpriteFrames(): void {
        // Load sprite từ atlas (gộp trong một DrawCall)
        const spriteFrame = this.characterAtlas!.getSpriteFrame('character_idle');
        if (!spriteFrame) {
            throw new Error('Sprite frame not found in atlas');
        }
    }

    // Tối ưu update: tránh cấp phát, dùng object pooling
    protected update(dt: number): void {
        // Chạy thao tác nặng mỗi N frame thay vì mỗi frame
        this.frameCount++;
        if (this.frameCount % 10 === 0) {
            this.updateExpensiveOperation();
        }
    }

    private updateExpensiveOperation(): void {
        // Tái sử dụng mảng thay vì tạo mới
        this.tempNodes.length = 0;

        // Gộp thao tác để giảm DrawCall
    }
}
```

## Checklist review code

### Kiểm tra nhanh (trước khi commit)

**🔴 Chất lượng code (KIỂM TRA TRƯỚC):**
- [ ] TypeScript strict mode bật trong `tsconfig.json`
- [ ] ESLint pass (không lỗi)
- [ ] Access modifier đúng (public/private/protected)
- [ ] Ném exception khi lỗi (không im lặng)
- [ ] `console.log` đã xóa hoặc bọc `CC_DEBUG`
- [ ] `readonly` dùng cho field không gán lại
- [ ] `const` dùng cho hằng số
- [ ] Không comment inline (code tự giải thích)
- [ ] Xử lý null/undefined đúng cách
- [ ] Không dùng type `any` (dùng type phù hợp)

**🟡 Pattern TypeScript hiện đại:**
- [ ] Dùng phương thức mảng thay vòng lặp thủ công
- [ ] Arrow function cho callback
- [ ] Optional chaining (`?.`) truy cập property an toàn
- [ ] Nullish coalescing (`??`) cho giá trị mặc định
- [ ] Destructuring cho code gọn hơn
- [ ] Type guard thu hẹp type

**🟢 Kiến trúc Cocos Creator:**
- [ ] Lifecycle Component đúng thứ tự
- [ ] `onLoad()` khởi tạo, `start()` tham chiếu
- [ ] Event listener đăng ký trong `onEnable()`
- [ ] Event listener hủy trong `onDisable()`
- [ ] Tài nguyên giải phóng trong `onDestroy()`
- [ ] Decorator `@property` dùng đúng
- [ ] Reference bắt buộc đã validate (throw nếu null)

**🔵 Performance playable:**
- [ ] Không cấp phát bộ nhớ trong vòng `update()`
- [ ] Sprite atlas dùng để gộp lệnh DrawCall
- [ ] GPU skinning bật cho animation xương
- [ ] Thao tác nặng được throttle (không chạy mỗi frame)
- [ ] Object pooling cho object tạo thường xuyên
- [ ] Nén texture đã bật
- [ ] Kích thước bundle mục tiêu <5MB
- [ ] Số DrawCall mục tiêu <10

## Lỗi thường gặp cần tránh

### ❌ KHÔNG NÊN:
1. **Bỏ qua TypeScript strict mode** → Bật `"strict": true`
2. **Xử lý lỗi im lặng** → Ném exception khi lỗi
3. **Để `console.log` trong production** → Xóa hoặc bọc `CC_DEBUG`
4. **Bỏ access modifier** → Dùng public/private/protected
5. **Dùng type `any`** → Định nghĩa type và interface phù hợp
6. **Thêm comment inline** → Dùng tên mô tả thay thế
7. **Bỏ cleanup event** → Luôn hủy trong `onDisable`/`onDestroy`
8. **Cấp phát trong `update()`** → Cấp phát trước và tái sử dụng object
9. **Quên Sprite atlas** → Dùng atlas để gộp lệnh DrawCall
10. **Logic nặng trong `update()`** → Throttle thao tác tốn kém
11. **Bỏ kiểm tra null** → Validate reference bắt buộc trong `onLoad`
12. **Field `@property` mutable** → Dùng `readonly` khi phù hợp
13. **Vòng lặp thủ công trên mảng** → Dùng map/filter/reduce
14. **Bỏ qua kích thước bundle** → Theo dõi và tối ưu (mục tiêu <5MB)

### ✅ NÊN:
1. **Bật TypeScript strict mode** (`"strict": true`)
2. **Ném exception khi lỗi** (không im lặng)
3. **Dùng `console.log` chỉ khi dev** (xóa khi production)
4. **Dùng access modifier** (public/private/protected)
5. **Định nghĩa type phù hợp** (tránh `any`)
6. **Dùng tên mô tả** (không comment inline)
7. **Luôn cleanup event** (`onDisable`/`onDestroy`)
8. **Cấp phát trước object** (tái sử dụng trong `update()`)
9. **Dùng Sprite atlas** (gộp lệnh DrawCall)
10. **Throttle thao tác nặng** (không chạy mỗi frame)
11. **Validate reference bắt buộc** (throw trong `onLoad` nếu null)
12. **Dùng `readonly` cho `@property`** (khi phù hợp)
13. **Dùng phương thức mảng** (map/filter/reduce)
14. **Theo dõi kích thước bundle** (mục tiêu <5MB cho playable)

## Mức độ nghiêm trọng khi review

### 🔴 Nghiêm trọng (Bắt buộc sửa)
- **TypeScript strict mode tắt** — Phải bật `"strict": true`
- **Xử lý lỗi im lặng** — Phải ném exception khi lỗi
- **`console.log` trong code production** — Xóa hoặc bọc `CC_DEBUG`
- **Thiếu access modifier** — Mọi member phải có modifier
- **Dùng type `any` không có lý do** — Định nghĩa type phù hợp
- **Comment inline thay tên mô tả** — Đổi tên và xóa comment
- **Event listener không cleanup** — Rò rỉ bộ nhớ, phải hủy đăng ký
- **Thiếu validate reference bắt buộc** — Phải throw trong `onLoad` nếu null
- **Cấp phát bộ nhớ trong vòng `update()`** — Quan trọng với performance, phải cấp phát trước
- **Không dùng Sprite atlas cho nhiều sprite** — DrawCall tăng vọt, phải dùng atlas
- **Kích thước bundle >5MB** — Vượt giới hạn playable, phải tối ưu

### 🟡 Quan trọng (Nên sửa)
- **Thiếu `readonly` trên field `@property`** — Nên dùng `readonly` khi không gán lại
- **Thiếu `const` cho hằng số** — Nên dùng `const` thay `let`
- **Vòng lặp thủ công thay phương thức mảng** — Nên dùng map/filter/reduce
- **Thiếu optional chaining** — Nên dùng `?.` truy cập an toàn
- **Thiếu nullish coalescing** — Nên dùng `??` cho giá trị mặc định
- **Logic nặng trong `update()`** — Nên throttle thao tác tốn kém
- **Không object pooling cho cấp phát thường xuyên** — Nên triển khai pooling
- **Chưa bật nén texture** — Nên bật để giảm bundle
- **Số DrawCall >10** — Nên tối ưu gộp lệnh

### 🟢 Gợi ý (Tùy chọn)
- Có thể dùng arrow function cho callback
- Có thể destructuring cho code gọn hơn
- Có thể dùng type guard cho type safety
- Có thể cải thiện tên cho rõ ràng hơn
- Có thể thêm interface cho typing tốt hơn
- Có thể tối ưu thuật toán cho performance tốt hơn

## Tham chiếu chi tiết

### Chuẩn ngôn ngữ TypeScript
- [Quality & Hygiene](references/language/quality-hygiene.md) — Strict mode, ESLint, access modifier, xử lý lỗi
- [Modern TypeScript](references/language/modern-typescript.md) — Phương thức mảng, optional chaining, type guard, utility type
- [Performance](references/language/performance.md) — Tối ưu vòng update, không cấp phát bộ nhớ, caching

### Framework Cocos Creator
- [Component System](references/framework/component-system.md) — Hệ EC, lifecycle, decorator `@property`
- [Event Patterns](references/framework/event-patterns.md) — EventDispatcher, event Node, cleanup subscription
- [Playable Optimization](references/framework/playable-optimization.md) — Gộp lệnh DrawCall, Sprite atlas, GPU skinning, object pooling
- [Size Optimization](references/framework/size-optimization.md) — Giảm kích thước bundle, nén texture, tối ưu build

### Review code
- [Architecture Review](references/review/architecture-review.md) — Vi phạm Component, lỗi lifecycle, rò rỉ event
- [Quality Review](references/review/quality-review.md) — Vấn đề chất lượng TypeScript, access modifier, xử lý lỗi
- [Performance Review](references/review/performance-review.md) — Vấn đề performance playable, DrawCall, cấp phát bộ nhớ

## Tóm tắt

Skill này cung cấp chuẩn phát triển Cocos Creator toàn diện cho team playable ads của TheOne Studio:
- **TypeScript xuất sắc**: Strict mode, pattern hiện đại, type safety
- **Kiến trúc Cocos**: Lifecycle Component, pattern event, quản lý tài nguyên
- **Performance playable**: Gộp lệnh DrawCall, GPU skinning, bundle <5MB
- **Chất lượng code**: Quy tắc chất lượng, vệ sinh code và performance được áp dụng nghiêm

Dùng Bảng tra cứu nhanh phía trên để điều hướng tới pattern cụ thể bạn cần.
