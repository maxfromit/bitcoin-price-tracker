import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../db/schema"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.")
}

const queryClient = postgres(DATABASE_URL, {
  prepare: false,
})

export const db = drizzle(queryClient, { schema })
