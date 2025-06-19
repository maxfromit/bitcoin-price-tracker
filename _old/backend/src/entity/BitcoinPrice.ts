import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

/**
 * Bitcoin Price Entity - Test Task Implementation
 * Stores essential Bitcoin price data for historical chart display
 * Optimized for simplicity and rapid development
 */
@Entity("bitcoin_prices")
@Index(["closePriceUsd", "evaluatedAt", "createdAt"]) // Fast historical queries for chart data
export class BitcoinPrice {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  /**
   * Bitcoin price in USD - Close price from API
   * Primary data point for historical price charts
   */
  @Column({
    name: "close_price_usd",
    type: "decimal",
    precision: 18,
    scale: 8,
  })
  closePriceUsd!: string

  /**
   * Price timestamp converted from API Unix timestamp
   * Essential for time-series chart rendering
   */
  @Column({
    name: "evaluated_at",
    type: "timestamptz",
  })
  evaluatedAt!: Date

  /**
   * Record creation timestamp for audit
   */
  @Column({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date
}
