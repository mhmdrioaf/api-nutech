import express, { Request, Response } from 'express'
import { errorHandler } from "./lib/utils"
import config from "./config/config"
import { authRoutes } from './modules/auth/routes/auth.routes'
import { profileRoutes } from './modules/profile/routes/profile.routes'
import { bannersRoutes } from './modules/banners/routes/banners.routes'
import { servicesRoutes } from './modules/services/routes/services.routes'
import { walletRoutes } from './modules/transactions/routes/wallet.routes'
import { transactionRoutes } from './modules/transactions/routes/transactions.routes'

const app = express()

app.use(express.json())

app.use(
    authRoutes,
    profileRoutes,
    bannersRoutes,
    servicesRoutes,
    walletRoutes,
    transactionRoutes,
)

app.use((req: Request, res: Response, next: Function) => {
    next(errorHandler(req, res))
})

app.listen(config.APP_PORT, () => {
    console.log('[server]: Server is running at http://localhost:' + config.APP_PORT)
})