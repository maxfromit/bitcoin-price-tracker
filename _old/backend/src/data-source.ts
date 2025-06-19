import { DataSource } from "typeorm"

console.log("Postgres config:", {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD, // For debugging only!
  database: process.env.POSTGRES_DB,
})

/**
 * PostgreSQL DataSource configuration for Bitcoin Price Tracker
 * Uses environment variables for consistent configuration across services
 */
export const AppDataSource = new DataSource({
  type: "postgres",

  // Connection parameters from environment variables
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  // Development configuration
  synchronize: true, // Auto-sync schema (development only)
  logging: true, // Enable query logging for debugging

  // Entity and migration paths
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
})
