# Database Architecture

## Overview
Flowra uses **PostgreSQL** as its core database, managed via **Prisma ORM**.

> [!WARNING]
> Flowra does NOT require Docker or Supabase. The application must connect to a standard PostgreSQL instance using a standard `DATABASE_URL` format.

## Configuration Requirements

Your environment variables must include a valid PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

If you are using a connection pooler (like PgBouncer or Supabase's transaction pooler), you must also provide a `DIRECT_URL` for Prisma migrations:

```env
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### Local Development
For local development, you must have PostgreSQL installed and running on your machine. You can use standard local credentials (e.g., `postgresql://postgres:postgres@localhost:5432/flowra`).

### Testing
Integration tests require a separate, isolated database to prevent data destruction.
Configure this in your `.env` or `.env.test`:

```env
TEST_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/flowra_test"
```

## Migration Procedure

When schema changes are made in `prisma/schema.prisma`:

1. Generate the Prisma Client:
   `npm run db:generate` (or `npx prisma generate`)
2. Push changes to development (if prototyping):
   `npm run db:push`
3. Create a formal migration (for production):
   `npm run db:migrate`

> [!CAUTION]
> Never run `prisma migrate reset` against production data. Do not perform destructive migrations that drop tables containing user data without a strict migration plan.
