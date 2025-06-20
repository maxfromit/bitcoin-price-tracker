import type { BitcoinPrice } from "~~/server/db/schema"

export const transformPriceDataForGraph = (prices?: BitcoinPrice[]) => {
  if (!prices || !Array.isArray(prices)) {
    return []
  }
  return prices.map((price) => [
    Number(price.evaluatedAt) * 1000,
    Number(price.closePriceUsd),
  ])
}
