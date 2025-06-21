// import type { DateValue } from "@internationalized/date"
import type { CalendarDate } from "@internationalized/date"

export type DateRange = {
  start: CalendarDate | null
  end: CalendarDate | null
}

export type Period = "1d" | "1w" | "1m" | "1y" | "all" | "custom"
