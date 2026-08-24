# Testing Strategy

## Test Database Strategy
For the MVP, we use the same Supabase PostgreSQL instance but isolated via a dedicated schema. 
- **DATABASE_URL** → `schema=public`
- **TEST_DATABASE_URL** → `schema=test`

Integration tests MUST NEVER use `DATABASE_URL`. They must strictly run against `TEST_DATABASE_URL`.
If `TEST_DATABASE_URL` is missing, tests must fail immediately and not silently fallback.
If they resolve to the exact same database and schema, integration tests must refuse to run.

## Migration Procedure
To push the schema to the test database:
```powershell
$env:DATABASE_URL=$env:TEST_DATABASE_URL
$env:DIRECT_URL=$env:TEST_DIRECT_URL
npx prisma db push --accept-data-loss
```

## Test Execution
Tests are executed using Vitest.
```bash
npm run test
```

## Cleanup Strategy
- Integration tests must wrap operations in transactions and rollback where practical.
- Where transaction rollback is not possible (e.g. testing cross-tenant isolation), deterministic cleanup using `db.$executeRawUnsafe('TRUNCATE TABLE "Organization" CASCADE')` must be run `afterEach` or `afterAll`.
- Never execute destructive cleanup against the `public` schema. Always assert the URL contains `schema=test` before TRUNCATE operations.
