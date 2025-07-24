import express, { Request, Response } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import topupDto from '../dto/topup.dto'
import { Transaction } from '../actions/transactions.actions'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { prisma } from '../../..'

const router = express.Router()

router.post('/topup', authMiddleware, checkSchema(topupDto), async (req: Request, res: Response) => {
    const validatorResult = validationResult(req)
    if (validatorResult.isEmpty()) {
        const transaction = new Transaction(prisma)

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

export { router as transactionRoutes }