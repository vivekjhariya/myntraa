# Myntraa

A polished, Myntra-inspired fashion storefront built with React, Vite and Express. It includes a responsive catalog, search and filtering, product details, wishlist, cart drawer, coupon validation, authentication, theme toggle and a seeded product collection.

## Run locally

```bash
npm install
cp .env.example .env # on Windows, copy .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server proxies no API calls: the frontend defaults to `/api`, so use the included Vite development setup with the API at port 3001, or set `VITE_API_URL=http://localhost:3001/api` in `.env`.

For a production-style single server:

```bash
npm run build
NODE_ENV=production npm start
```

The production server serves `dist` and the API on port 3001. Docker Compose starts the app with MySQL:

```bash
docker compose up --build
```

## Project structure

The client is organized by application shell, reusable UI, feature boundaries,
pages, services, hooks, and shared libraries:

```
src/app             router and application providers
src/components      layout and reusable UI
src/features        auth, cart, catalog, and wishlist boundaries
src/pages            route-level screens
src/services         API clients
src/hooks            shared state hooks
src/lib              formatting and utilities
server               config, routes, controllers, services, middleware, data
```

## Persistence and API

Without database variables, signup/login and cart data use a graceful in-memory demo store. When MySQL variables are available, users are stored in the `users` table; the app still falls back safely if MySQL cannot be reached. Products are seeded in `server.js` and mirrored in `server/data/products.js` for
feature-oriented server modules so the demo works immediately.

On startup, the API creates the schema required by the application: `users`,
`cart_items`, `orders`, and `order_items`. The same migration-safe statements
are documented in `server/data/schema.sql`. Checkout writes an order and its
line items to MySQL and clears the user's persisted cart after a successful
transaction.

Endpoints include `GET /api/products` (and the modular `GET /api/catalog/products`),
`POST /api/auth/signup`, `POST /api/auth/login`, authenticated cart CRUD at
`/api/cart`, authenticated order history at `GET /api/orders`, order creation at
`POST /api/orders`, `POST /api/coupons/validate`, and `GET /api/health`.

## Notes

This is a self-contained demo storefront. Replace `JWT_SECRET`, use HTTPS, add a payment provider and add production-grade validation/rate limiting before launching publicly.

## pull dockerHub  latest image
docker pull vjstylose/myntraa:latest
