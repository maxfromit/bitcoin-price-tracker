import type { PredefinedPeriod } from "~/components/BitcoinPriceChart/types"

export const getLabelByPeriod = (
  selectedPeriod: PredefinedPeriod,
  isTheSameYear: boolean
) => {
  if (selectedPeriod === "1m") {
    return "{value:%d %B}"
  }
  if (selectedPeriod === "1y") {
    return "{value: %d %B }"
  }

  return `${isTheSameYear ? `{value:%d %B}` : `{value:%B %Y}`}` // e.g., 20 Jun or 20 Jun 2025
}
