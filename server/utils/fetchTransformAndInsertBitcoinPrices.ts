import { db } from "./db"
import { gt } from "drizzle-orm"
import { bitcoinPrice } from "../db/schema"
import { fetchHistoricalPrices } from "./fetchHistoricalPrices"
import { transformFetchedDataForBitcoinPrice } from "./transformFetchedDataForBitcoinPrice"

export async function fetchTransformAndInsertBitcoinPrices(
  instruction?: "insertAll"
): Promise<void> {
  try {
    console.log("Starting to fetch, transform, and insert Bitcoin prices...")
    // Step 1: Fetch historical prices
    if (instruction === "insertAll") {
      console.log("deleting all historical prices as per instruction.")
      await db.delete(bitcoinPrice)
    }

    const countRows = await db.$count(bitcoinPrice)
    console.log("countRows", countRows)

    const fetchedData = []
    // const fetchedData = await fetchHistoricalPrices()

    if (fetchedData.length === countRows && countRows > 0) {
      console.log("No new data to insert. Exiting function.")
      return
    }

    const latest = await db.query.bitcoinPrice.findFirst({
      orderBy: (table, { desc }) => [desc(table.evaluatedAt)],
    })
    console.log("Latest evaluatedAt:", latest?.evaluatedAt)

    const dataToInsert =
      countRows !== 0 && latest
        ? fetchedData.filter(
            (item) =>
              typeof item.TIMESTAMP === "number" &&
              item.TIMESTAMP > latest?.evaluatedAt
          )
        : fetchedData

    // Step 2: Transform the fetched data

    // Step 3: Insert transformed data into the database
    if (dataToInsert.length > 0) {
      const transformedData = transformFetchedDataForBitcoinPrice(dataToInsert)
      console.log(`inserting ${transformedData.length} rows`)
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
