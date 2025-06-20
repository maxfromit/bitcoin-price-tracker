import l from "lodash"

import { getCalendarDateFromUnixTimestamp } from "~/components/BitcoinPriceChart/utils/getCalendarDateFromUnixTimestamp"
import { tz } from "~/components/BitcoinPriceChart/utils/tz"

import type { DateRange } from "../types"
import type { BitcoinPrice } from "~~/server/db/schema"

export const filterPricesBySelectedRange = (
  prices: BitcoinPrice[],
  range: DateRange
) => {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return []
  }

  return l.filter(prices, (price) => {
    const parsedDate = getCalendarDateFromUnixTimestamp(price.evaluatedAt, tz)
    const isGreater = !range.start || parsedDate.compare(range.start) >= 0
    const isLess = !range.end || parsedDate.compare(range.end) <= 0
    return isGreater && isLess
  })
}
