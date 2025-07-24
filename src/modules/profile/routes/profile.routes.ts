import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { prisma } from '../../..'
import { profileUpdateDto } from '../dto/profile-update.dto'

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

router.put('/profile/update', authMiddleware, async (req: Request, res: Response) => {
    if (req.user) {
        const firstName = req.body.first_name ?? undefined
        const lastName = req.body.last_name ?? undefined

        const updatePayload = {
            first_name: firstName,
            last_name: lastName
        }

        const user = await prisma.users.update({
            where: {
                email: req.user.email,
            },
            data: updatePayload,
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