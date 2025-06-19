import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"
import * as dotenvExpand from "dotenv-expand"

const env = dotenv.config()
dotenvExpand.expand(env)

// const runtimeConfig = useRuntimeConfig()

// console.log("runtimeConfig", runtimeConfig.public.apiBase)

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
})
