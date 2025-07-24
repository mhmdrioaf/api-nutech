import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { prisma } from '../../..'

const router = express.Router()

router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
    if (req.user) {
        const user = await prisma.users.findFirst({
            where: {
                email: req.user.email
            },
            omit: {
                id: true,
                password: true,
            }
        })

        if (user) {
            return res.status(200).json({
                status: 0,
                message: 'Sukses',
                data: user,
            })
        } else {
            return res.status(400).json({
                status: 102,
                message: 'Data tidak ditemukan',
                data: null,
            })
        }
    } else {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kedaluwarsa',
            data: null,
        })
    }
})

export { router as profileRoutes }