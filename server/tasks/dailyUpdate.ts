import { fetchTransformAndInsertBitcoinPrices } from "~~/server/utils"

export default defineTask({
  meta: {
    name: "dailyUpdate",
    description: "Daily updating bitcoin prices in the database with new price",
  },
  async run() {
    const dataFetchLimit = 5
    console.log(
      "Running daily update for Bitcoin prices..., fetching last",
      dataFetchLimit,
      "days"
    )
    try {
      await fetchTransformAndInsertBitcoinPrices(dataFetchLimit)
      return { result: "success" }
    } catch (error) {
      console.error("Error during daily update of Bitcoin prices:", error)
      return {
        result: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }
  },
})
