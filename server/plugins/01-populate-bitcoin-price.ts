import { fetchTransformAndInsertBitcoinPrices } from "../utils/fetchTransformAndInsertBitcoinPrices"

export default defineNitroPlugin(async () => {
  try {
    await fetchTransformAndInsertBitcoinPrices()
    console.log(
      "Plugin 01-populate-bitcoin-price: bitcoin prices populated successfully."
    )
  } catch (error) {
    console.error("Failed to populate Bitcoin prices:", error)
  }
})
