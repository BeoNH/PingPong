# PingPong — Hướng dẫn cho Agent

## Dự án

Game Ping Pong trên **Cocos Creator 3.8.7**, ngôn ngữ **TypeScript**.

## Cấu trúc chính

| Thư mục | Mục đích |
|---------|----------|
| `assets/scripts/` | Script TypeScript (Component, Manager) |
| `assets/scenes/` | Scene game |
| `assets/resources/` | Asset load runtime |

## Quy tắc quan trọng

1. **Không sửa** `library/`, `temp/`, `local/`, `build/`, `profiles/`
2. Script mới đặt trong `assets/scripts/`
3. Component Cocos dùng decorator `@ccclass`, `@property`
4. Giữ thay đổi tối thiểu, khớp style code hiện có
5. Không tự ý commit hoặc tạo file docs không được yêu cầu

## Rules & Skills Cursor

### Rules (`.cursor/rules/`)

- `project-overview.mdc` — luôn áp dụng
- `cocos-typescript.mdc` — khi làm việc với `assets/**/*.ts`

### Skill: theone-cocos-standards

Skill TheOne Studio đã cài tại `.cursor/skills/the1studio-theone-training-skills-theone-cocos-standards/`.

**Luôn đọc `SKILL.md` trước khi viết/review code Cocos TypeScript.** Ưu tiên:

1. Code quality — strict mode, access modifiers, throw exception, readonly/const
2. Modern TypeScript — map/filter/reduce, optional chaining, type guards
3. Cocos architecture — lifecycle, EventDispatcher, cleanup listener
4. Playable performance — DrawCall batching, zero allocation trong `update()`

## TypeScript & ESLint

- `tsconfig.json`: `"strict": true` (bắt buộc theo TheOne standards)
- Chạy lint: `npm run lint` / `npm run lint:fix`
- Cấu hình: `.eslintrc.json` (TheOne: access modifiers, no `any`, explicit return types)
