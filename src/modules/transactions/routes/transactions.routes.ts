/**
 * @swagger
* /balance:
 *  get:
 *      security:
 *          -   bearerAuth: []
 *      tags:
 *          - 3. Module Transaction
 *      summary: Informasi saldo
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
 *                                  example: Get Balance berhasil
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      balance:
 *                                          type: number
 *                                          example: 150000
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
 * /topup:
 *  post:
 *      security:
 *          -   bearerAuth: []
 *      tags:
 *          - 3. Module Transaction
 *      summary: Topup Saldo
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          top_up_amount:
 *                              type: number
 *                              example: 10000

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
 *                                  example: Top Up Balance berhasil
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      balance:
 *                                          type: number
 *                                          example: 150000
 *          400:
 *              description: Invalid top_up_amount
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
 *                                  example: Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0
 *                              data:
 *                                  type: object
 *                                  example: null
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
 * /transaction:
 *  post:
 *      security:
 *          -   bearerAuth: []
 *      tags:
 *          - 3. Module Transaction
 *      summary: Pembayaran layanan
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          service_code:
 *                              type: string
 *                              example: PULSA

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
 *                                  example: Transaksi Berhasil
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      invoice_number:
 *                                          type: string
 *                                          example: 2d559fb4-8e01-4def-8695-bc3684ea2af7
 *                                      transaction_type:
 *                                          type: string
 *                                          example: PAYMENT
 *                                      description:
 *                                          type: string
 *                                          example: Pulsa
 *                                      total_amount:
 *                                          type: number
 *                                          example: 15000
 *                                      created_on:
 *                                          type: string
 *                                          example: 2025-07-24T20:41:42.097Z
 *          400:
 *              description: Layanan tidak ditemukan
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 102
 *                              message:
 *                                  type: string
 *                                  example: Service atau layanan tidak ditemukan
 *                              data:
 *                                  type: object
 *                                  example: null
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
 * /transaction/history:
 *  get:
 *      security:
 *          -   bearerAuth: []
 *      tags:
 *          - 3. Module Transaction
 *      summary: Riwayat transaksi
 *      parameters:
 *          -   in: query
 *              name: offset
 *              schema:
 *                  type: integer
 *                  example: 0
 *              required: false
 *              description: Dapatkan data dari indeks ke-
 *          -   in: query
 *              name: limit
 *              schema:
 *                  type: integer
 *                  example: 3
 *              required: false
 *              description: Batasi data yang didapatkan
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
 *                              offset:
 *                                  type: number
 *                                  example: 0
 *                              limit:
 *                                  type: number
 *                                  example: 3
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          invoice_number:
 *                                              type: string
 *                                          transaction_type:
 *                                              type: string
 *                                          description:
 *                                              type: string
 *                                          total_amount:
 *                                              type: number
 *                                          created_on:
 *                                              type: string
 *                                  example:
 *                                      -   invoice_number: a54de6d9-5cbf-404b-aef2-4a53af8c40eb
 *                                          transaction_type: TOPUP
 *                                          description: Top Up Balance
 *                                          total_amount: 100000
 *                                          created_on: 2025-07-24T20:39:55.599Z
 *                                      -   invoice_number: d54de6d2-a3bf-v04b-aef2-4a53af8c40eb
 *                                          transaction_type: PAYMENT
 *                                          description: Pajak PBB
 *                                          total_amount: 40000
 *                                          created_on: 2025-07-24T22:39:55.599Z
 *                                      -   invoice_number: s54de6d2-a3bf-v04b-aef2-4a53af8c40eb
 *                                          transaction_type: PAYMENT
 *                                          description: Listrik PLN
 *                                          total_amount: 100000
 *                                          created_on: 2025-07-24T19:39:55.599Z
 *          400:
 *              description: Layanan tidak ditemukan
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 102
 *                              message:
 *                                  type: string
 *                                  example: Service atau layanan tidak ditemukan
 *                              data:
 *                                  type: object
 *                                  example: null
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
import { checkSchema, validationResult } from 'express-validator'
import topupDto from '../dto/topup.dto'
import { Transaction } from '../actions/transactions.actions'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { servicePaymentDto } from '../dto/servicePayment.dto'
import db from '../../../lib/database'

const router = express.Router()

router.post('/topup', authMiddleware, checkSchema(topupDto), async (req: Request, res: Response) => {
    const validatorResult = validationResult(req)
    if (validatorResult.isEmpty()) {
        const transaction = new Transaction(db)

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

router.post('/transaction', authMiddleware, checkSchema(servicePaymentDto), async (req: Request, res: Response) => {
    const validatorResult = validationResult(req)
    if (!validatorResult.isEmpty()) {
        const errors = validatorResult.array()
        const firstError = errors.at(0)
        return res.status(400).json({
            status: 102,
            message: firstError?.msg ?? '',
            data: null
        })
    }

    const transaction = new Transaction(db)
    const transactionResult = await transaction.payService(req.user!.email, req.body.service_code)

    if (transactionResult.status !== 0 && transactionResult.status !== 500) {
        return res.status(400).json(transactionResult)
    }

    if (transactionResult.status === 500) {
        return res.status(500).json(transactionResult)
    }

    return res.status(200).json(transactionResult)
})

router.get('/transaction/history', authMiddleware, async (req: Request, res: Response) => {
    const limitQuery = Number(req.query.limit)
    let limit = null

    if (!isNaN(limitQuery)) limit = limitQuery

    const offsetQuery = Number(req.query.offset)
    let offset = 0
    if (!isNaN(offsetQuery)) offset = offsetQuery

    const transaction = new Transaction(db)
    const transactionHistory = await transaction.history(req.user!.email, offset, limit)

    let paginationResponse: Partial<TPagination> = {
        offset,
    }

    if (limit) {
        paginationResponse = {
            ...paginationResponse,
            limit,
        }
    }
    
    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        ...paginationResponse,
        data: transactionHistory,
    })
})

export { router as transactionRoutes }