/**
 * PGlite dialect stub — PGlite is disabled on this deployment.
 * Auth uses Postgres only when DATABASE_URL is set.
 */
import type {
  DatabaseIntrospector,
  Dialect,
  Kysely,
  QueryCompiler,
} from "kysely";
import {
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "kysely";

export function pgliteDialect(_getClient: () => Promise<unknown> | unknown): Dialect {
  return {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => {
      throw new Error("PGlite dialect is disabled. Set DATABASE_URL.");
    },
    createQueryCompiler: (): QueryCompiler => new PostgresQueryCompiler(),
    createIntrospector: (db: Kysely<unknown>): DatabaseIntrospector =>
      new PostgresIntrospector(db),
  };
}
