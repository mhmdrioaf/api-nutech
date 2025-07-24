import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { prisma } from '../../..'

const router = express.Router()

router.get('/balance', authMiddleware, async (req: Request, res: Response) => {
    try {
        const reqUser = req.user!

        const user = await prisma.users.findFirst({
            where: {
                email: reqUser.email,
            },
            select: {
                id: true,
            }
        })

        if (user) {
            const wallet = await prisma.users_wallet.upsert({
                where: {
                    owner_id: user.id,
                },
                update: {
                    owner_id: user.id,
                },
                create: {
                    balance: 0,
                    owner_id: user.id,
                },
                select: {
                    balance: true,
                },
            })

            if (wallet) {
                const result = {
                    balance: wallet.balance.toNumber()
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
        } else {
            return res.status(400).json({
                status: 102,
                message: 'User tidak ditemukan',
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