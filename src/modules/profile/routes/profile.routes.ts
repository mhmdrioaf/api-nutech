import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import { prisma } from '../../..'
import { profileUpdateDto } from '../dto/profile-update.dto'
import upload from '../middlewares/upload.middleware'
import cloudinary from '../../../lib/cloudinary'
import { MulterError } from 'multer'

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

router.put('/profile/image', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
    try {
        const allowedFiles = ['image/jpeg', 'image/png']

        if (!req.file) {
            return res.status(400).json({
                status: 102,
                message: 'Field file tidak boleh kosong',
                data: null,
            })
        }

        if (!allowedFiles.includes(req.file.mimetype)) {
            return res.status(400).json({
                status: 102,
                message: 'Format Image tidak sesuai',
                data: null
            })
        }

        const reqUser = req.user!

        const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

        const uploadResult = await cloudinary.uploader.upload(base64File, {
            folder: 'nutech',
        })

        if (uploadResult.secure_url) {
            const user = await prisma.users.update({
                where: {
                    email: reqUser.email,
                },
                data: {
                    profile_image: uploadResult.secure_url,
                },
                omit: {
                    id: true,
                    password: true,
                }
            })

            return res.status(200).json({
                status: 0,
                message: 'Update Profile Image berhasil',
                data: user,
            })
        }
    } catch (err: any) {
        console.error('[PROFILE_UPDATE] terjadi kesalahan ketika mengupload foto: ', err)
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null,
        })
    }
})

export { router as profileRoutes }