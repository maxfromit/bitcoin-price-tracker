import { tz } from "~/components/BitcoinPriceChart/utils/tz"
import type { ModelRef } from "vue"

import type { DateRange, PredefinedPeriod } from "../types"
import type { CalendarDate } from "@internationalized/date"
import {
  today,
  startOfYear,
  startOfMonth,
  startOfWeek,
} from "@internationalized/date"

export const useUpdateDateRangeBySelectedPeriod = ({
  selectedRange,
  predefinedPeriod,
  customPeriodInDays,
  firstDate,
}: {
  selectedRange: ModelRef<DateRange>
  predefinedPeriod: PredefinedPeriod
  customPeriodInDays?: number | null
  firstDate: CalendarDate | undefined
}) => {
  selectedRange.value.end = today(tz)

  if (predefinedPeriod === "1d") {
    selectedRange.value.start = selectedRange.value.end.copy()
  }

  if (predefinedPeriod === "1w") {
    selectedRange.value.start = startOfWeek(selectedRange.value.end, "fr-FR")
  }

  if (predefinedPeriod === "1m") {
    selectedRange.value.start = startOfMonth(selectedRange.value.end)
  }

  if (predefinedPeriod === "1y") {
    selectedRange.value.start = startOfYear(selectedRange.value.end)
  }

  if (!predefinedPeriod && customPeriodInDays) {
    selectedRange.value.start = selectedRange.value.end.subtract({
      days: customPeriodInDays,
    })
  }

  if (
    (predefinedPeriod === "all" ||
      (!predefinedPeriod && !customPeriodInDays)) &&
    firstDate
  ) {
    selectedRange.value.start = firstDate.copy()
  }
  return
}
