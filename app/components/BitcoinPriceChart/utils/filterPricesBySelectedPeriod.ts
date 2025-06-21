import l from "lodash"

import { getCalendarDateFromUnixTimestamp } from "~/components/BitcoinPriceChart/utils/getCalendarDateFromUnixTimestamp"
import { getDayOfWeek } from "@internationalized/date"
import { tz } from "~/components/BitcoinPriceChart/utils/tz"

import type { BitcoinPrice } from "~~/server/db/schema"
import type { Period } from "../types"

export const filterPricesBySelectedPeriod = (
  prices: BitcoinPrice[],
  period: Period,
  periodInDays: number | null
) => {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return []
  }

  const isElementFirstOrLastInArray = (index: number, arrayLength: number) => {
    return index === 0 || index === arrayLength - 1
  }

  if (period === "1w") {
    return l.filter(prices, (price, index) => {
      const priceDate = getCalendarDateFromUnixTimestamp(price.evaluatedAt, tz)
      return (
        getDayOfWeek(priceDate, "fr-FR") === 0 ||
        isElementFirstOrLastInArray(index, l.size(prices))
      )
    })
  }

  if (period === "1m") {
    return l.filter(prices, (price, index) => {
      const priceDate = getCalendarDateFromUnixTimestamp(price.evaluatedAt, tz)
      return (
        priceDate.day === 1 ||
        isElementFirstOrLastInArray(index, l.size(prices))
      )
    })
  }

  if (period === "1y") {
    return l.filter(prices, (price, index) => {
      const priceDate = getCalendarDateFromUnixTimestamp(price.evaluatedAt, tz)
      return (
        (priceDate.day === 1 && priceDate.month === 1) ||
        isElementFirstOrLastInArray(index, l.size(prices))
      )
    })
  }

  if (period === "custom" && periodInDays) {
    return l.filter(prices, (price, index) => {
      return (
        (periodInDays && (index + 1) % periodInDays === 0) ||
        isElementFirstOrLastInArray(index, l.size(prices))
      )
    })
  }
  return prices
}
