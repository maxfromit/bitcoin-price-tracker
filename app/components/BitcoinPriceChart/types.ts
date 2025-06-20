import type { DateValue } from "@internationalized/date"

export type DateRange = {
  start: DateValue | null
  end: DateValue | null
}

export type Period = "1d" | "1w" | "1m" | "1y" | "all" | "custom"
