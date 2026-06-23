# create-ahad-backend

[![npm version](https://img.shields.io/npm/v/create-ahad-backend.svg)](https://www.npmjs.com/package/create-ahad-backend)
[![license](https://img.shields.io/npm/l/create-ahad-backend.svg)](./LICENSE)

Scaffold a production-shaped **Node.js + Express + TypeScript + TypeORM + PostgreSQL + JWT** backend in one command.

## Why

Most starters either dump in too much (auth providers, queues, microservices) or too little (a bare `app.listen`). `create-ahad-backend` generates a small, real backend with a working email/password auth flow — `POST /register`, `POST /login`, `GET /me` — backed by TypeORM and PostgreSQL, so you have something to build on immediately.

## Usage

```sh
npx create-ahad-backend
```

```
create-ahad-backend
Scaffold an Express + TypeScript + TypeORM + PostgreSQL + JWT backend.

? Project name: my-api
? Database name: my_api
? Server port: 4000

✔ Project created.

Done! Next steps:

  cd my-api
  npm install
  npm run dev
```

<!-- TODO: add a GIF/screenshot of the CLI run here -->

Then create the PostgreSQL database named in your `.env` (`DATABASE_NAME`) before running `npm run dev`.

## What you get

```
my-api/
├── src/
│   ├── index.ts             # Express app bootstrap
│   ├── data-source.ts       # TypeORM DataSource (reads env vars)
│   ├── entities/User.ts      # id, email (unique), password (hashed), createdAt
│   ├── middleware/auth.ts    # JWT verification middleware
│   ├── middleware/error.ts   # central error handler
│   ├── routes/auth.routes.ts # POST /register, POST /login
│   ├── routes/user.routes.ts # GET /me (protected)
│   ├── controllers/
│   └── utils/jwt.ts
├── .env                       # generated for you, including a random JWT secret
└── tsconfig.json
```

- **Express** for routing and middleware.
- **TypeORM** + **PostgreSQL** for persistence (`synchronize: true` for fast local iteration).
- **JWT** auth via `jsonwebtoken`, password hashing via `bcryptjs`.
- **zod** request validation.
- Each generated project gets its own randomly generated `JWT_SECRET` — never a shared default.

## Roadmap (v2)

- JavaScript-only output option (no TypeScript)
- Prisma as an alternative to TypeORM
- MySQL / MongoDB support
- Optional Redux instead of plain state for any generated client glue

## Contributing

Issues and PRs welcome.

## License

MIT

---

See also: [create-ahad-frontend](https://www.npmjs.com/package/create-ahad-frontend) — the matching Next.js frontend scaffold.
