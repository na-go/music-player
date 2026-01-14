---
description: Guide for database operations with Drizzle ORM and Cloudflare D1
patterns:
  - "db/schema/**"
  - "**/migrations/**"
keywords:
  - "drizzle"
  - "migration"
  - "schema"
  - "database"
  - "d1"
---

# Database Operations

## Stack

- **ORM**: Drizzle ORM
- **Database**: Cloudflare D1 (SQLite)
- **Schema location**: `db/schema/`
- **Migrations**: Auto-generated in `migrations/`

## Workflow

1. **Edit schema** in `db/schema/*.ts`
2. **Generate migration**: `npm run generate`
3. **Apply to local D1**: `npm run migrate`
4. **Apply to production D1**: `npm run production-migrate`

## Schema Definition Pattern

```typescript
// db/schema/tracks.ts
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const tracks = sqliteTable('tracks', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  duration: integer('duration').notNull(),
}, (track) => ({
  // Indexes
  nameIdx: uniqueIndex('nameIdx').on(track.name),
  urlIdx: uniqueIndex('urlIdx').on(track.url),
}));
```

## Column Types

- `integer('name')` - INTEGER
- `text('name')` - TEXT
- `real('name')` - REAL

## Constraints

```typescript
.primaryKey()                           // Primary key
.primaryKey({ autoIncrement: true })    // Auto-increment
.notNull()                              // NOT NULL
.unique()                               // UNIQUE constraint
.default(value)                         // DEFAULT value
```

## Indexes

```typescript
sqliteTable('table_name', {
  // columns
}, (table) => ({
  nameIdx: uniqueIndex('nameIdx').on(table.name),
  multiIdx: index('multiIdx').on(table.col1, table.col2),
}));
```

## Commands

```bash
# Generate migration from schema changes
npm run generate

# Apply migrations to local D1 (requires .env file)
npm run migrate

# Apply migrations to production D1 (requires .env file)
npm run production-migrate
```

## Environment Variables

Migrations require `.env` file with:

```bash
DATABASE_NAME=your-d1-database-name
```

## Migration Files

- Auto-generated in `migrations/` directory
- SQL format
- Applied in order (timestamped)
- **Do not edit manually** - regenerate if schema changes

## Troubleshooting

If migration fails:
1. Check `.env` file exists and has correct `DATABASE_NAME`
2. Check Wrangler authentication: `wrangler whoami`
3. For local issues, delete `.wrangler/` and retry
4. For production, verify D1 database exists in Cloudflare dashboard

## Checklist

- [ ] Schema defined in `db/schema/*.ts`
- [ ] Ran `npm run generate` after schema changes
- [ ] Tested migration on local D1 with `npm run migrate`
- [ ] Applied to production with `npm run production-migrate` when ready
