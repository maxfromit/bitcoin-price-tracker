import type {
  HistoricalPriceItem,
  HistoricalPriceResponse,
} from "~~/server/types"

const baseUrl = "https://data-api.coindesk.com/index/cc/v1/historical/days"
const DAY_SECONDS = 86400

export async function fetchHistoricalPrices(dataFetchLimit?: number) {
  const allData: HistoricalPriceItem[] = []

  let toTs: number | undefined
  let keepFetching = true
  let limit = 2000
  const url = new URL(baseUrl)

  const options = {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }

  while (keepFetching) {
    // if dataFetchLimit is set, adjust the limit accordingly: it should not exceed the remaining data to fetch
    if (dataFetchLimit) {
      limit = Math.min(limit, dataFetchLimit - allData.length)
    }

    const params = {
      market: "cadli",
      instrument: "BTC-USD",
      limit: String(limit),
      aggregate: "1",
      fill: "true",
      apply_mapping: "true",
      response_format: "JSON",
      ...(toTs ? { to_ts: String(toTs) } : {}),
    }

    url.search = new URLSearchParams(params).toString()

    try {
      const response = await fetch(url.toString(), options)

      if (!response.ok) {
        const errorResponse = await response.json()
        throw {
          status: response.status,
          statusText: response.statusText,
          details: errorResponse,
        }
      }

      const res = (await response.json()) as HistoricalPriceResponse
      const batch = res.Data
      if (!batch || !Array.isArray(batch) || !batch[0]?.TIMESTAMP) {
        console.warn(
          "No data found in the response or data is not an array or TIMESTAMP is missing"
        )
        keepFetching = false
        break
      }

      allData.push(...batch)
      keepFetching =
        batch.length >= parseInt(params.limit, 10) &&
        ((dataFetchLimit && allData.length < dataFetchLimit) || !dataFetchLimit)

      const earliest = batch[0].TIMESTAMP
      toTs = earliest - DAY_SECONDS // Set to the earliest timestamp minus one day
    } catch (error) {
      console.error("Error fetching historical prices")
      throw error
    }
  }
  console.log("fetchHistoricalPrices allData length:", allData.length)
  return allData
}
