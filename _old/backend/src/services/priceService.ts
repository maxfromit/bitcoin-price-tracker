import { AppDataSource } from "../data-source"
import { BitcoinPrice } from "../entity/BitcoinPrice"

interface ApiPriceData {
  CLOSE: number | string
  TIMESTAMP: number // Unix timestamp (seconds)
}

export async function saveBitcoinPrice(apiData: ApiPriceData) {
  const repo = AppDataSource.getRepository(BitcoinPrice)

  const entity = repo.create({
    closePriceUsd: apiData.CLOSE.toString(),
    date: new Date(apiData.TIMESTAMP * 1000), // Convert Unix seconds to JS Date
  })

  await repo.save(entity)
  return entity
}
