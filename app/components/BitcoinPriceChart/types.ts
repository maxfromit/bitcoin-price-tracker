// import type { DateValue } from "@internationalized/date"
import type { CalendarDate } from "@internationalized/date"

export type DateRange = {
  start: CalendarDate | null
  end: CalendarDate | null
}

export const predefinedPeriods = [
  "today",
  "this week",
  "this month",
  "this year",
  "all",
] as const

export type PredefinedPeriod = (typeof predefinedPeriods)[number]
