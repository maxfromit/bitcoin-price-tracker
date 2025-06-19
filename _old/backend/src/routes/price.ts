import { Router } from "express"
import type { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { BitcoinPrice } from "../entity/BitcoinPrice"

const priceRouter = Router()

/**
 * GET /api/price
 * Returns all Bitcoin price records, ordered by evaluatedAt ascending.
 * Query params: from, to (ISO date strings, optional)
 */
priceRouter.get("/", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(BitcoinPrice)
    const { from, to } = req.query

    const where: any = {}
    if (from) where.evaluatedAt = { $gte: new Date(from as string) }
    if (to) {
      where.evaluatedAt = where.evaluatedAt || {}
      where.evaluatedAt.$lte = new Date(to as string)
    }

    const prices = await repo.find({
      where,
      order: { evaluatedAt: "ASC" },
    })

    res.json(prices)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

/**
 * POST /api/price
 * Adds a new Bitcoin price record.
 */
priceRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { closePriceUsd, evaluatedAt } = req.body
    if (!closePriceUsd || !evaluatedAt) {
      res
        .status(400)
        .json({ error: "closePriceUsd and evaluatedAt are required" })
      return
    }
    const repo = AppDataSource.getRepository(BitcoinPrice)
    const entity = repo.create({
      closePriceUsd,
      evaluatedAt: new Date(evaluatedAt),
    })
    await repo.save(entity)
    res.status(201).json(entity)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

/**
 * GET /api/price/:id
 * Returns a single Bitcoin price record by ID.
 */

/**
 * PUT /api/price/:id
 * Updates a Bitcoin price record by ID.
 */

/**
 * DELETE /api/price/:id
 * Deletes a Bitcoin price record by ID.
 */

export default priceRouter
