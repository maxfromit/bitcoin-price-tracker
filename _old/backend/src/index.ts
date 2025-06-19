import "reflect-metadata"
import { AppDataSource } from "./data-source"
import express from "express"
import priceRouter from "./routes/price"

// This is your backend application entry point
console.log("Backend service starting...")

const app = express()
app.use(express.json())
app.use("/api/price", priceRouter)

// Your TypeORM and backend logic will go here
AppDataSource.initialize()
  .then(() => {
    app.listen(3001, () => {
      console.log("Backend listening on port 3001")
    })
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })
