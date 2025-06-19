export interface HistoricalPriceItem {
  UNIT: string
  TIMESTAMP: number // Unix timestamp in seconds
  TYPE: string
  MARKET: string
  INSTRUMENT: string
  OPEN: number
  HIGH: number
  LOW: number
  CLOSE: number
  FIRST_MESSAGE_TIMESTAMP?: number
  LAST_MESSAGE_TIMESTAMP?: number
  FIRST_MESSAGE_VALUE?: number
  HIGH_MESSAGE_VALUE?: number
  HIGH_MESSAGE_TIMESTAMP?: number
  LOW_MESSAGE_VALUE?: number
  LOW_MESSAGE_TIMESTAMP?: number
  LAST_MESSAGE_VALUE?: number
  VOLUME?: number
  QUOTE_VOLUME?: number
  VOLUME_TOP_TIER?: number
  QUOTE_VOLUME_TOP_TIER?: number
  VOLUME_DIRECT?: number
  QUOTE_VOLUME_DIRECT?: number
  VOLUME_TOP_TIER_DIRECT?: number
  QUOTE_VOLUME_TOP_TIER_DIRECT?: number
  TOTAL_INDEX_UPDATES?: number
}

export interface HistoricalPriceResponse {
  Data: HistoricalPriceItem[]
  Err: Record<string, unknown> // Empty object or error details
}
