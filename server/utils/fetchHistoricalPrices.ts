import type {
  HistoricalPriceItem,
  HistoricalPriceResponse,
} from "~~/server/types"

const baseUrl = "https://data-api.coindesk.com/index/cc/v1/historical/days"
// const params = {
//   market: "cadli",
//   instrument: "BTC-USD",
//   limit: 1,
//   aggregate: 1,
//   fill: "true",
//   apply_mapping: "true",
//   response_format: "JSON",
// }

export async function fetchHistoricalPrices(
  limit?: string
): Promise<HistoricalPriceItem[]> {
  const url = new URL(baseUrl)

  const params = {
    market: "cadli",
    instrument: "BTC-USD",
    limit: limit ? limit : "2",
    aggregate: "1",
    fill: "true",
    apply_mapping: "true",
    response_format: "JSON",
  }

  url.search = new URLSearchParams(params).toString()

  const options = {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }
  // console.log("Fetching historical prices from url.toString():", url.toString())
  // console.log("Fetching historical prices from url:", url)
  // console.log("params:", params)

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

    // console.log("Response status:", response)
    const res = (await response.json()) as HistoricalPriceResponse

    console.log("Count of fetched rows", res.Data.length) // Log the fetched data
    console.log("Example of Data", res.Data) // Log the fetched data

    return res.Data
  } catch (error) {
    console.error("Error fetching historical prices")
    throw error // Re-throw the error to let the caller handle it
  }
}
