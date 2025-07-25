import express, { Request, Response } from 'express'
import db from '../../../lib/database'

const router = express.Router()

router.get('/banner', async (_req: Request, res: Response) => {
    const query = `
        select
            banner_name,
            banner_image,
            description
        from banners
    `
    const result = await db.query<Partial<TBanner>>(query)
    const banners = result.rows

    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: banners,
    })
})

export { router as bannersRoutes }