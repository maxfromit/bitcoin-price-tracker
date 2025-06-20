export default defineTask({
  // give the task a name and a description
  meta: {
    name: "daily_update",
    description: "Daily updating bitcoin prices in the database with new price",
  },
  async run() {
    console.log("Running daily update for Bitcoin prices...")
    try {
      await fetchTransformAndInsertBitcoinPrices()
      return { result: "success" }
    } catch (error) {
      console.error("Error during daily update of Bitcoin prices:", error)
      return {
        result: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }
    // provide the logic to seed the database
  },
})
