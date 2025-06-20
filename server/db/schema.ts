import { pgTable, integer, text, decimal, index } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const bitcoinPrice = pgTable(
  "bitcoin_price",
  {
    id: text().primaryKey().$defaultFn(createId),

    closePriceUsd: decimal("close_price_usd", {
      precision: 18,
      scale: 8,
    }).notNull(),

    // evaluatedAt: timestamp("evaluated_at", {
    //   withTimezone: true,
    //   mode: "string",
    // })
    //   .notNull()
    //   .unique(),
    evaluatedAt: integer("evaluated_at").notNull().unique(),
  },
  (table) => [
    index("bitcoin_price_close_price_usd_idx").on(table.closePriceUsd),
    index("bitcoin_price_evaluated_at_idx").on(table.evaluatedAt),
  ]
)
