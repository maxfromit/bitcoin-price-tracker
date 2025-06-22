import { db } from "./db"
import { bitcoinPriceTable } from "../db/schema"
import { fetchHistoricalPrices } from "./fetchHistoricalPrices"
import { transformFetchedDataForBitcoinPrice } from "./transformFetchedDataForBitcoinPrice"

export async function fetchTransformAndInsertBitcoinPrices(
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
