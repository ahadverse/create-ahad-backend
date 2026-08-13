# create-ahad-backend

[![npm version](https://img.shields.io/npm/v/create-ahad-backend.svg)](https://www.npmjs.com/package/create-ahad-backend)
[![license](https://img.shields.io/npm/l/create-ahad-backend.svg)](./LICENSE)

Scaffold a production-shaped **Node.js + Express + TypeScript + TypeORM + PostgreSQL + JWT** backend in one command.

```sh
npx create-ahad-backend
```

> **Run it, don't install it.** `npm i create-ahad-backend` only downloads the package into `node_modules` — it will not scaffold anything. Use one of these instead:
>
> ```sh
> npx create-ahad-backend        # npm
> npm create ahad-backend        # npm shorthand
> yarn create ahad-backend       # yarn
> pnpm create ahad-backend       # pnpm
> ```

## Why

Most starters either dump in too much (auth providers, queues, microservices) or too little (a bare `app.listen`). `create-ahad-backend` generates a small, real backend with a working email/password auth flow (`POST /register`, `POST /login`, `GET /me`) plus a second resource (`/posts`) showing relations, pagination, and ownership-based authorization — organized by feature, with typed env config and a typed error hierarchy, so you have something real to build on immediately.

## Usage

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
  npm run migration:run
  npm run dev
```

Create the PostgreSQL database named in your `.env` (`DATABASE_NAME`) before running `npm run migration:run`.

## What you get

```
my-api/
├── src/
│   ├── index.ts            # Express app bootstrap
│   ├── data-source.ts      # TypeORM DataSource (reads typed env config)
│   ├── config/env.ts       # zod-validated env vars, fails fast on misconfiguration
│   ├── types/api.ts        # ApiResponse<T>, Paginated<T> response envelope types
│   ├── errors/              # AppError + NotFound/Unauthorized/Forbidden/Conflict/Validation
│   ├── middleware/           # auth.ts, error.ts, notFound.ts
│   ├── utils/                # asyncHandler.ts, logger.ts, jwt.ts
│   ├── migrations/            # one migration per entity (user, then post)
│   └── modules/
│       ├── auth/                # POST /register, POST /login
│       ├── user/                # GET /me
│       └── posts/               # GET/POST /posts, GET/PUT/DELETE /posts/:id
├── .env                    # generated for you, including a random JWT secret
├── .gitignore
├── README.md               # how to run it, the route table, how to add a resource
├── package.json
└── tsconfig.json
```

- **Express** for routing and middleware, organized by feature module rather than by type.
- **TypeORM** + **PostgreSQL** for persistence, with an initial migration instead of `synchronize: true` — run `npm run migration:run` after creating the database, `npm run migration:generate` when you add entities.
- **Typed errors**: controllers `throw` (`NotFoundError`, `ForbiddenError`, etc.) instead of manual `try/catch` — a shared `asyncHandler` forwards them to a central error handler that maps each to the right status code.
- **JWT** auth via `jsonwebtoken`, password hashing via `bcryptjs`. The password column is `select: false`, so the hash stays out of any query that does not explicitly ask for it and can never leak through a serialized `User`.
- **zod** request validation, plus a typed `env.ts` that validates `process.env` once at startup and lists every missing/invalid variable.
- Every success response is `{ data: ... }`; every error is `{ error: string }`; unmatched routes get a clean 404 instead of Express's default HTML page.
- Each generated project gets its own randomly generated `JWT_SECRET` — never a shared default.

## Contributing

Issues and PRs welcome.

## License

MIT

---

See also: [create-ahad-frontend](https://www.npmjs.com/package/create-ahad-frontend) — the matching Next.js frontend scaffold.
