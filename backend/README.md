Project: Job Portal (backend microservices)

Services:

- auth-service
- user-service
- job-service
- gateway (API gateway / aggregator)
- rag-service (retrieval-augmented generation helper)

Shared libs:

- libs/logger

DB: MongoDB (accessed via Prisma or Drizzle where applicable)

Setup (high level)

- Copy .env files for each service and set values.
- Install dependencies per service (express, prisma client, zod, bcryptjs, jsonwebtoken, winston, morgan, typescript, ts-node, etc.).
- Generate Prisma client: run `npx prisma generate` from the `backend` folder after installing prisma and setting MONGO_URI.
- Start services (each service has a `src/index.ts` entrypoint). Use `ts-node` or build with `tsc`.

Note: This repository contains only source code. Run `yarn init` / `npm init` and install the packages before running.
