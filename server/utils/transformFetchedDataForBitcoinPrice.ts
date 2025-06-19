import type { HistoricalPriceItem } from "~~/server/types"

export function transformFetchedDataForBitcoinPrice(
  fetchedData: HistoricalPriceItem[]
) {
  return fetchedData.flatMap((item) => {
    if (typeof item.CLOSE === "number" && typeof item.TIMESTAMP === "number") {
      return [
        {
          closePriceUsd: item.CLOSE.toString(),
          evaluatedAt: new Date(item.TIMESTAMP * 1000).toISOString(),
        },
      ]
    }
    return []
  })
}
