import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import db from '../../../lib/database'

const router = express.Router()

router.get('/balance', authMiddleware, async (req: Request, res: Response) => {
    try {
        const reqUser = req.user!
        const query = await db.query<Partial<TWallet>>(`
            select balance from users_wallet uw
            join users u on
                u.id = uw.owner_id
                and u.email = $1
        `, [reqUser.email])
        const wallet = query.rowCount ? query.rows[0] : null
        if (wallet) {
            const result = {
                balance: Number(wallet.balance)
            }

            return res.status(200).json({
                status: 0,
                message: 'Get Balance berhasil',
                data: result,
            })
        } else {
            return res.status(400).json({
                status: 102,
                message: 'Wallet tidak ditemukan',
                data: null,
            })
        }
    } catch (error) {
        console.error('[BALANCE]: terjadi kesalahan ketika mendapatkan balance user: ', error)

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null,
        })
    }
})

export { router as walletRoutes }