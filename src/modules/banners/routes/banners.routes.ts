import express, { Request, Response } from 'express'
import { prisma } from '../../..'

const router = express.Router()

router.get('/banner', async (_req: Request, res: Response) => {
    const banners = await prisma.banners.findMany({
        omit: {
            id: true,
        }
    })

    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: banners,
    })
})

export { router as bannersRoutes }