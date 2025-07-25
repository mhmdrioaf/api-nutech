/**
 * @swagger
 * /banner:
 *  get:
 *      tags:
 *          - 2. Module Information
 *      summary: List banner
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 0
 *                              message:
 *                                  type: string
 *                                  example: Sukses
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          banner_name:
 *                                              type: string
 *                                          banner_image:
 *                                              type: string
 *                                          description:
 *                                              type: string
 *                                  example:
 *                                      -   banner_name: Banner 1
 *                                          banner_image: https://nutech-integrasi.app/dummy.jpg
 *                                          description: Lerem Ipsum Dolor sit amet
 *                                      -   banner_name: Banner 2
 *                                          banner_image: https://nutech-integrasi.app/dummy.jpg
 *                                          description: Lerem Ipsum Dolor sit amet
 *                                      -   banner_name: Banner 3
 *                                          banner_image: https://nutech-integrasi.app/dummy.jpg
 *                                          description: Lerem Ipsum Dolor sit amet
 * /services:
 *  get:
 *      security:
 *          -   bearerAuth: []
 *      tags:
 *          - 2. Module Information
 *      summary: List layanan
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 0
 *                              message:
 *                                  type: string
 *                                  example: Sukses
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          service_code:
 *                                              type: string
 *                                          service_name:
 *                                              type: string
 *                                          service_icon:
 *                                              type: string
 *                                          service_tarif:
 *                                              type: integer
 *                                  example:
 *                                      -   service_code: PULSA
 *                                          service_name: Pulsa
 *                                          service_icon: https://nutech-integrasi.app/dummy.jpg
 *                                          service_tarif: 50000
 *                                      -   service_code: Listrik
 *                                          service_name: Listrik PLN
 *                                          service_icon: https://nutech-integrasi.app/dummy.jpg
 *                                          service_tarif: 100000
 *                                      -   service_code: TV
 *                                          service_name: TV Berlangganan
 *                                          service_icon: https://nutech-integrasi.app/dummy.jpg
 *                                          service_tarif: 150000
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 108
 *                              message:
 *                                  type: string
 *                                  example: Token tidak valid atau kedaluwarsa
 *                              data:
 *                                  type: object
 *                                  example: null
 */

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