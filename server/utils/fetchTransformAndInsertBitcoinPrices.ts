import { db } from "./db"
import { bitcoinPrice } from "../db/schema"
import { fetchHistoricalPrices } from "./fetchHistoricalPrices"
import { transformFetchedDataForBitcoinPrice } from "./transformFetchedDataForBitcoinPrice"
export async function fetchTransformAndInsertBitcoinPrices(
  instruction?: "insertAll" | "insertLatest"
): Promise<void> {
  try {
    console.log("Starting to fetch, transform, and insert Bitcoin prices...")

    if (instruction === "insertAll") {
      console.log("deleting all historical prices as per instruction.")
      await db.delete(bitcoinPrice)
    }

    const countExistedRows = await db.$count(bitcoinPrice)
    console.log("countRows", countExistedRows)

    const fetchedData = await fetchHistoricalPrices(
      instruction === "insertLatest" ? 5 : undefined
    )

    if (fetchedData.length === countExistedRows && countExistedRows > 0) {
      console.log("No new data to insert. Exiting function.")
      return
    }

    let latestBitcoinPrice = null
    if (instruction === "insertLatest") {
      console.log("Fetching only the latest Bitcoin prices...")
      latestBitcoinPrice = await db.query.bitcoinPrice.findFirst({
        orderBy: (table, { desc }) => [desc(table.evaluatedAt)],
      })
      console.log("Latest evaluatedAt:", latestBitcoinPrice?.evaluatedAt)
    }

    const dataToInsert =
      countExistedRows !== 0 && latestBitcoinPrice
        ? fetchedData.filter(
            (item) =>
              typeof item.TIMESTAMP === "number" &&
              item.TIMESTAMP > latestBitcoinPrice?.evaluatedAt
          )
        : fetchedData

    if (dataToInsert.length > 0) {
      const transformedData = transformFetchedDataForBitcoinPrice(dataToInsert)

      console.log(`inserting ${transformedData.length} rows`)
      const insertedDates = await db
        .insert(bitcoinPrice)
        .values(transformedData)
        .onConflictDoNothing()
        .returning({ insertedDates: bitcoinPrice.evaluatedAt })
      // setLoadingState(null)

      console.log(
        "Data successfully inserted into bitcoin_price table.",
        insertedDates
      )
    } else {
      console.log("No valid data to insert into bitcoin_price table.")
    }
  } catch (error) {
    console.error("Error inserting bitcoin prices:", error)
    throw error
  }
}
