import express, { Request, Response } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import * as bcrypt from 'bcrypt'
import { registerDto } from '../dto/register.dto'
import { loginDto } from '../dto/login.dto'
import { JWTAuth } from '../../../lib/jwt'
import db from '../../../lib/database'

const router = express.Router()

router.post('/registration', checkSchema(registerDto), async (req: Request, res: Response) => {
    try {
        const validatorResult = validationResult(req)
        if (validatorResult.isEmpty()) {
            const payload = {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: await bcrypt.hash(req.body.password, 10)
            }

            const usersQuery = `
                insert into users (
                    email,
                    first_name,
                    last_name,
                    password
                ) values ($1, $2, $3, $4)
                returning
                    id,
                    email,
                    first_name,
                    last_name,
                    password
            `
            const usersPayload = [payload.email, payload.first_name, payload.last_name, payload.password]
            const result = await db.query<TUser>(usersQuery, usersPayload)

            if (result.rowCount) {
                const usersWalletQuery = `
                    insert into users_wallet (
                        balance,
                        owner_id
                    ) values ($1, $2)
                `
                const usersWalletPayload = [0, result.rows[0].id]

                const walletResult = await db.query<TWallet>(usersWalletQuery, usersWalletPayload)

                if (walletResult.rowCount) {
                    res.status(200).json({
                        status: 0,
                        message: 'Registrasi berhasil silakan login',
                        data: null,
                    })
                }

                res.status(500).json({
                    status: 500,
                    message: 'Internal server error',
                    data: null,
                })
            } else {
                res.status(500).json({
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
    } catch (err: any) {
        if (err?.code === '23505') {
            return res.status(400).json({
                status: 102,
                message: 'Email telah terdaftar',
                data: null,
            })
        }

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null,
        })
    }
})

router.post('/login', checkSchema(loginDto), async (req: Request, res: Response) => {
    try {
        const validatorResult = validationResult(req)

        if (validatorResult.isEmpty()) {
            const query = `
                select
                    email,
                    first_name,
                    last_name,
                    password
                from users u
                where u.email = $1
            `
            const values = [req.body.email]
            
            const results = await db.query<TUser>(query, values)

            if (results.rowCount) {
                const user = results.rows[0]
                const isMatch = await bcrypt.compare(req.body.password, user.password)

                if (isMatch) {
                    const jwt = new JWTAuth({ email: user.email })
                    const accessToken = jwt.generateToken()
                    return res.status(200).json({
                        status: 0,
                        message: 'Login sukses',
                        data: {
                            token: accessToken,
                        }
                    })
                } else {
                    return res.status(400).json({
                        status: 103,
                        message: 'Username atau password salah',
                        data: null,
                    })
                }
            } else {
                return res.status(400).json({
                    status: 103,
                    message: 'Username atau password salah',
                    data: null,
                })
            }
        } else {
            const errors = validatorResult.array()
            const firstError = errors.at(0)

            return res.status(400).json({
                status: 102,
                message: firstError?.msg ?? '',
                data: null,
            })
        }
    } catch (err) {
        console.error('[AUTH]: Terjadi kesalahan ketika login pengguna: ', err)

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null,
        })
    }
})

export { router as authRoutes }