import express, { Request, Response } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import topupDto from '../dto/topup.dto'
import { Transaction } from '../actions/transactions.actions'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { servicePaymentDto } from '../dto/servicePayment.dto'
import db from '../../../lib/database'

const router = express.Router()

router.post('/topup', authMiddleware, checkSchema(topupDto), async (req: Request, res: Response) => {
    const validatorResult = validationResult(req)
    if (validatorResult.isEmpty()) {
        const transaction = new Transaction(db)

        const userEmail = req.user!.email
        const topupAmount = Number(req.body.top_up_amount)

        const transactionResponse = await transaction.topup(userEmail, topupAmount)
        if (transactionResponse) {
            return res.status(200).json({
                status: 0,
                message: 'Top Up Balance berhasil',
                data: transactionResponse,
            })
        } else {
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
                data: null,
            })
        }
    } else {
        const errors = validatorResult.array()
        const firstError = errors.at(0)

        res.status(400).send({
            status: 102,
            message: firstError?.msg ?? '',
            data: null,
        })
    }
})

router.post('/transaction', authMiddleware, checkSchema(servicePaymentDto), async (req: Request, res: Response) => {
    const validatorResult = validationResult(req)
    if (!validatorResult.isEmpty()) {
        const errors = validatorResult.array()
        const firstError = errors.at(0)
        return res.status(400).json({
            status: 102,
            message: firstError?.msg ?? '',
            data: null
        })
    }

    const transaction = new Transaction(db)
    const transactionResult = await transaction.payService(req.user!.email, req.body.service_code)

    if (transactionResult.status !== 0 && transactionResult.status !== 500) {
        return res.status(400).json(transactionResult)
    }

    if (transactionResult.status === 500) {
        return res.status(500).json(transactionResult)
    }

    return res.status(200).json(transactionResult)
})

router.get('/transaction/history', authMiddleware, async (req: Request, res: Response) => {
    const limitQuery = Number(req.query.limit)
    let limit = null

    if (!isNaN(limitQuery)) limit = limitQuery

    const offsetQuery = Number(req.query.offset)
    let offset = 0
    if (!isNaN(offsetQuery)) offset = offsetQuery

    const transaction = new Transaction(db)
    const transactionHistory = await transaction.history(req.user!.email, offset, limit)
    
    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: transactionHistory,
    })
})

export { router as transactionRoutes }