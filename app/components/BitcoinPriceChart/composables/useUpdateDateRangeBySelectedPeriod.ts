import { tz } from "~/components/BitcoinPriceChart/utils"

import {
  today,
  startOfYear,
  startOfMonth,
  startOfWeek,
} from "@internationalized/date"

import type { ModelRef } from "vue"
import type { CalendarDate } from "@internationalized/date"
import type { DateRange, PredefinedPeriod } from "../types"

export const useUpdateDateRangeBySelectedPeriod = ({
  selectedRange,
  predefinedPeriod,
  customPeriodInDays,
  firstDate,
}: {
  selectedRange: ModelRef<DateRange>
  predefinedPeriod: PredefinedPeriod | null
  customPeriodInDays: number | null
  firstDate: CalendarDate | undefined
}) => {
  selectedRange.value.end = today(tz)

  if (predefinedPeriod === "today") {
    selectedRange.value.start = selectedRange.value.end.copy()
  }

  if (predefinedPeriod === "this week") {
    selectedRange.value.start = startOfWeek(selectedRange.value.end, "fr-FR")
  }

  if (predefinedPeriod === "this month") {
    selectedRange.value.start = startOfMonth(selectedRange.value.end)
  }

  if (predefinedPeriod === "this year") {
    selectedRange.value.start = startOfYear(selectedRange.value.end)
  }

  if (
    (predefinedPeriod === "all" ||
      (!predefinedPeriod && !customPeriodInDays)) &&
    firstDate
  ) {
    selectedRange.value.start = firstDate.copy()
  }

  if (!predefinedPeriod && customPeriodInDays) {
    selectedRange.value.start = selectedRange.value.end.subtract({
      days: customPeriodInDays,
    })
  }

  return
}
