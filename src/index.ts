import express, { Request, Response } from 'express'
import { errorHandler } from "./lib/utils"
import config from "./config/config"
import { PrismaClient } from './generated/prisma'
import { authRoutes } from './modules/auth/routes/auth.routes'

export const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.use(authRoutes)

app.use((req: Request, res: Response, next: Function) => {
    next(errorHandler(req, res))
})

app.listen(config.APP_PORT, () => {
    console.log('[server]: Server is running at http://localhost:' + config.APP_PORT)
})