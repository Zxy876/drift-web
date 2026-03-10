# Drift Web

Drift Web 是 Drift Backend 的 Web 控制台（v1 起步版）。

当前已实现：

- `/player/[playerId]`：Player Dashboard（`GET /world/state/{player_id}`）
- `/narrative/[playerId]`：Narrative Map（`GET /narrative/graph` + `GET /world/state/{player_id}`）
- `/intent/[playerId]`：Intent Debugger（`GET /world/state/{player_id}` + 可选 `GET /world/story/{player_id}/debug/tasks`）
- `/scenes`：Scene Explorer（`GET /scenes/library`）
- `/settings/generation`：Generation Control（`GET /settings/generation` + `POST /settings/generation`）
- `/about`：系统定位与架构说明页

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- React Flow（已安装，后续用于 Narrative Map）

## Local Run

1. 安装依赖：

```bash
npm install
```

2. 配置后端地址（任选其一）：

- 复制 `.env.example` 为 `.env.local`
- 设置 `DRIFT_BACKEND_URL`（默认可用值：`http://127.0.0.1:8000`）

3. 启动：

```bash
npm run dev
```

4. 打开页面：

- `http://localhost:3000/player/demo_player`
- `http://localhost:3000/player/railway-smoke`
- `http://localhost:3000/narrative/railway-smoke`
- `http://localhost:3000/intent/railway-smoke`
- `http://localhost:3000/scenes`
- `http://localhost:3000/settings/generation`
- `http://localhost:3000/about`

## Validation

```bash
npm run lint
npm run build
```
