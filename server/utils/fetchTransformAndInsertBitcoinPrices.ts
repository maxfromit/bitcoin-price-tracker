import { db } from "./db"
import { bitcoinPrice } from "../db/schema"
import { fetchHistoricalPrices } from "./fetchHistoricalPrices"
import { transformFetchedDataForBitcoinPrice } from "./transformFetchedDataForBitcoinPrice"

export async function fetchTransformAndInsertBitcoinPrices(): Promise<void> {
  try {
    console.log("Starting to fetch, transform, and insert Bitcoin prices...")
    // Step 1: Fetch historical prices
    const fetchedData = await fetchHistoricalPrices()

    // Step 2: Transform the fetched data
    const transformedData = transformFetchedDataForBitcoinPrice(fetchedData)

    // Step 3: Insert transformed data into the database
    if (transformedData.length > 0) {
      await db.insert(bitcoinPrice).values(transformedData)
      console.log("Data successfully inserted into bitcoin_price table.")
    } else {
      console.log("No valid data to insert into bitcoin_price table.")
    }
  } catch (error) {
    console.error("Error inserting bitcoin prices:", error)
    throw error
  }
}
