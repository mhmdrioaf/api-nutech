import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import db from '../../../lib/database'

const router = express.Router()

router.get('/services', authMiddleware, async (_req: Request, res: Response) => {
    const query = `
        select
            service_code,
            service_name,
            service_icon,
            service_tarif
        from services
    `
    const result = await db.query<Partial<TService>>(query)
    const services = result.rows
    const results = services.map(service => ({
        ...service,
        service_tarif: Number(service.service_tarif)
    }))

    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: results,
    })
})

export { router as servicesRoutes }