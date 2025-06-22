import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "~~/server/db/schema"

import type {
  HistoricalPriceItem,
  HistoricalPriceResponse,
} from "~~/server/types"

import { bitcoinPriceTable } from "~~/server/db/schema"

// db
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.")
}

const queryClient = postgres(DATABASE_URL, {
  prepare: false,
})

const db = drizzle(queryClient, { schema })

// fetchHistoricalPrices
const baseUrl = "https://data-api.coindesk.com/index/cc/v1/historical/days"
const DAY_SECONDS = 86400

async function fetchHistoricalPrices(dataFetchLimit?: number) {
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

function transformFetchedDataForBitcoinPrice(
  fetchedData: HistoricalPriceItem[]
) {
  return fetchedData.flatMap((item) => {
    if (typeof item.CLOSE === "number" && typeof item.TIMESTAMP === "number") {
      return [
        {
          closePriceUsd: item.CLOSE.toString(),
          evaluatedAt: item.TIMESTAMP,
          //   evaluatedAt: new Date(item.TIMESTAMP * 1000).toISOString(),
        },
      ]
    }
    return []
  })
}

async function fetchTransformAndInsertBitcoinPrices(
  dataFetchLimit?: number
): Promise<void> {
  try {
    console.log("Starting to fetch, transform, and insert Bitcoin prices...")

    const countExistedRows = await db.$count(bitcoinPriceTable)
    console.log("countRows", countExistedRows)

    const fetchedData = await fetchHistoricalPrices(
      dataFetchLimit ? dataFetchLimit : undefined
    )

    if (fetchedData.length === countExistedRows && countExistedRows > 0) {
      console.log("No new data to insert. Exiting function.")
      return
    }

    if (fetchedData.length > 0) {
      const transformedData = transformFetchedDataForBitcoinPrice(fetchedData)

      console.log(`inserting ${transformedData.length} rows`)

      await db
        .insert(bitcoinPriceTable)
        .values(transformedData)
        .onConflictDoNothing()

      console.log("Data successfully inserted into bitcoin_price table.")
    } else {
      console.log("No valid data to insert into bitcoin_price table.")
    }
  } catch (error) {
    console.error("Error inserting bitcoin prices:", error)
    throw error
  }
}

export { db, fetchTransformAndInsertBitcoinPrices }
