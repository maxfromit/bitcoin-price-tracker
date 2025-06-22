import { db } from "~~/server/utils"
import { bitcoinPriceTable } from "~~/server/db/schema"

export default defineEventHandler(async () => {
  const bitcoinPrices = await db
    .select()
    .from(bitcoinPriceTable)
    .orderBy(bitcoinPriceTable.evaluatedAt)
  return bitcoinPrices
})
