import { db } from "~~/server/utils/db"
import { bitcoinPrice } from "~~/server/db/schema"

export default defineEventHandler(async () => {
  const prices = await db
    .select()
    .from(bitcoinPrice)
    .orderBy(bitcoinPrice.evaluatedAt)
  return prices
})
