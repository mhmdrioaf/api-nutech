import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { prisma } from '../../..'

const router = express.Router()

router.get('/services', authMiddleware, async (_req: Request, res: Response) => {
    const services = await prisma.services.findMany({
        omit: {
            id: true,
        }
    })

    const results = services.map(service => ({
        ...service,
        service_tarif: service.service_tarif.toNumber()
    }))

    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: results,
    })
})

export { router as servicesRoutes }