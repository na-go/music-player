import { DrizzleD1Database } from "drizzle-orm/d1";

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  db: DrizzleD1Database<Record<string, never>>;
};

export type Env = { Bindings: Bindings; Variables: Variables };
