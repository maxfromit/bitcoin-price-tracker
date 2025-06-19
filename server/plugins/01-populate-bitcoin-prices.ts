import { fetchTransformAndInsertBitcoinPrices } from "../utils/fetchTransformAndInsertBitcoinPrices"

export default async () => {
  await fetchTransformAndInsertBitcoinPrices()
}
