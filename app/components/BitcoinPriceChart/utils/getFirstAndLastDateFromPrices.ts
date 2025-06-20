import { getCalendarDateFromUnixTimestamp } from "~/components/BitcoinPriceChart/utils/getCalendarDateFromUnixTimestamp"
import { tz } from "~/components/BitcoinPriceChart/utils/tz"
import type { BitcoinPrice } from "~~/server/db/schema"

export const getFirstAndLastDateFromPrices = (
  prices: BitcoinPrice[],
  type: "first" | "last"
) => {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return null
  }
  let date = null
  if (type === "first" && prices[0]) {
    date = prices[0].evaluatedAt ?? null
  }

  if (type === "last" && !!prices[prices.length - 1]) {
    date = prices[prices.length - 1]?.evaluatedAt ?? null
  }

  if (!date) {
    return null
  }
  return getCalendarDateFromUnixTimestamp(date, tz)
}
