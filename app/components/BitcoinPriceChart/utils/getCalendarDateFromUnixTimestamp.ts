import { fromAbsolute, toCalendarDate } from "@internationalized/date"

export const getCalendarDateFromUnixTimestamp = (
  timestamp: number,
  tz: string
) => {
  return toCalendarDate(fromAbsolute(timestamp * 1000, tz)).copy()
}
