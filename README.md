# COZY Coffee Order

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

A full-stack coffee ordering web application where customers build an order and staff manage order progress and inventory from an operations dashboard.

[Open the live application](https://coffe-order-app-frontend.onrender.com/)

## Why this project

COZY connects customer choices, order state transitions, inventory updates, operational statistics, a REST API, and a relational database in one deployable store workflow.

## Product flow

| User | Flow |
| --- | --- |
| Customer | Browse menus → choose options → add to cart → adjust quantities → place an order |
| Staff | Review orders → start preparation → complete orders → inspect and adjust stock |
| Operator | Monitor total, received, preparing, and completed order counts |

## Core capabilities

- Menu cards with images, prices, and configurable options
- Cart quantity controls and order confirmation feedback
- Received, preparing, and completed order states
- Dashboard statistics derived from current orders
- Inventory visibility, manual adjustments, and workflow-linked stock deduction
- API process and PostgreSQL health endpoints
- Responsive customer and administration views

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 7 |
| Backend | Node.js 18+, Express 4 |
| Database | PostgreSQL |
| Deployment | Render |

## Architecture

```text
React client (ui)
  └─ REST via VITE_API_URL
       └─ Express API (server)
            ├─ /api/menus
            ├─ /api/orders
            ├─ /api/stock
            └─ PostgreSQL
```

```text
coffe-order-app/
├── ui/
│   ├── public/images/
│   └── src/
├── server/
│   ├── scripts/init-db.js
│   └── src/
├── DEPLOY-RENDER.md
└── PRD-화면.md
```

## Run locally

Create PostgreSQL database `coffe_order`, then start the API:

```bash
cd server
cp .env.example .env
npm install
node scripts/init-db.js
npm run dev
```

Start the web client in another terminal:

```bash
cd ui
cp .env.example .env
npm install
npm run dev
```

The API listens on [http://localhost:3000](http://localhost:3000), and the client runs at [http://localhost:5173](http://localhost:5173).

## Environment variables

| Location | Variable | Purpose |
| --- | --- | --- |
| `server` | `PORT` | Express port; defaults to `3000` |
| `server` | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Local PostgreSQL connection |
| `server` | `DATABASE_URL` | Hosted PostgreSQL connection string |
| `ui` | `VITE_API_URL` | Public base URL of the Express API |

Do not commit real database credentials or local `.env` files.

## API overview

| Method | Path | Responsibility |
| --- | --- | --- |
| GET | `/api/health`, `/api/health/db` | Process and database health |
| GET | `/api/menus` | List menus |
| GET, POST | `/api/orders` | List and create orders |
| GET | `/api/orders/stats` | Return order status totals |
| PATCH | `/api/orders/:id` | Change order state and apply stock logic |
| GET, PATCH | `/api/stock` | Read and adjust inventory |

## Verification

```bash
cd ui
npm run lint
npm run build
```

Start the backend and check both health endpoints. Then place a customer order and confirm that the staff dashboard, statistics, state transition, and inventory remain consistent.

## Deployment

The frontend and backend are separate Render services with PostgreSQL as the data layer. See [DEPLOY-RENDER.md](DEPLOY-RENDER.md).

## Current scope and security

This is a portfolio and learning project. The administration view and write endpoints currently have no authentication or role-based authorization. Before production use, add staff authentication, endpoint authorization, restrictive CORS, request validation, rate limiting, audit logging, and stronger transactional inventory controls.

## License

ISC
