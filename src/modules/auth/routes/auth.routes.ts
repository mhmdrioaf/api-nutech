import express, { Request, Response } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import * as bcrypt from 'bcrypt'
import { prisma } from '../../..'
import { registerDto } from '../dto/register.dto'
import { PrismaClientKnownRequestError } from '../../../generated/prisma/runtime/library'
import { loginDto } from '../dto/login.dto'

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

            const user = await prisma.users.create({
                data: payload
            })

            if (user) {
                res.status(200).json({
                    status: 0,
                    message: 'Registrasi berhasil silakan login',
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
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                res.status(400).send({
                    status: 102,
                    message: 'Alamat email telah terdaftar, silakan login atau gunakan email lain untuk melanjutkan',
                    data: null,
                })
            } else {
                console.error('[AUTH]: Terjadi kesalahan ketika registrasi user: ', err)
                res.status(500).send({
                    status: 102,
                    message: 'Internal server error',
                    data: null,
                })
            }
        } else {
            console.error('[AUTH]: Terjadi kesalahan ketika registrasi user: ', err)
            res.status(500).send({
                status: 102,
                message: 'Internal server error',
                data: null,
            })
        }
    }
})

router.post('/login', checkSchema(loginDto), async (req: Request, res: Response) => {
    try {
        const validatorResult = validationResult(req)

        if (validatorResult.isEmpty()) {
            const user = await prisma.users.findFirst({
                where: {
                    email: req.body.email,
                }
            })

            if (user) {
                const isMatch = await bcrypt.compare(req.body.password, user.password)

                if (isMatch) {
                    return res.status(200).json({
                        status: 0,
                        message: 'Login sukses',
                        data: {
                            token: null,
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