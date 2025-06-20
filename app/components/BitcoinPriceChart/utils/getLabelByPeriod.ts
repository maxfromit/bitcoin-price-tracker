import type { Period } from "~/components/BitcoinPriceChart/types"

export const getLabelByPeriod = (
  selectedPeriod: Period,
  isTheSameYear: boolean
) => {
  if (selectedPeriod === "1m") {
    return `${isTheSameYear ? `{value:%B}` : `{value:%B %Y}`}`
  }
  if (selectedPeriod === "1y") {
    return `{value: %Y}`
  }

  return `${isTheSameYear ? `{value:%d %B}` : `{value:%d %B %Y}`}` // e.g., 20 Jun or 20 Jun 2025
}
