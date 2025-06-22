import l from "lodash"

import {
  fromAbsolute,
  toCalendarDate,
  getLocalTimeZone,
} from "@internationalized/date"

import type { DateRange } from "~/components/BitcoinPriceChart/types"
import type { BitcoinPrice } from "~~/server/db/schema"

const filterPricesBySelectedRange = (
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

const getCalendarDateFromUnixTimestamp = (timestamp: number, tz: string) => {
  return toCalendarDate(fromAbsolute(timestamp * 1000, tz)).copy()
}

const getFirstAndLastCalendarDateFromBitcoinPrices = (
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

const transformPriceDataForGraph = (prices?: BitcoinPrice[]) => {
  if (!prices || !Array.isArray(prices)) {
    return []
  }
  return prices.map((price) => [
    Number(price.evaluatedAt) * 1000,
    Number(price.closePriceUsd),
  ])
}

const tz = getLocalTimeZone()

export {
  filterPricesBySelectedRange,
  getFirstAndLastCalendarDateFromBitcoinPrices,
  transformPriceDataForGraph,
  tz,
}
