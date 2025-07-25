import express, { Request, Response } from 'express'
import authMiddleware from '../../auth/middlewares/auth.middleware'
import upload from '../middlewares/upload.middleware'
import cloudinary from '../../../lib/cloudinary'
import db from '../../../lib/database'

const router = express.Router()

router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
    if (req.user) {
        const query = `
            select
                email,
                first_name,
                last_name,
                profile_image
            from users u
            where
                u.email = $1 
        `
        const values = [req.user.email]
        const result = await db.query<Partial<TUser>>(query, values)
        const user = result.rows?.[0] ?? null

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
    if (!req.user) return

    const firstName = req.body.first_name ?? undefined
    const lastName = req.body.last_name ?? undefined

    const updateFields: string[] = []
    const updateValues: any[] = []
    let fieldIndex = 1

    if (firstName) {
        updateFields.push(`first_name = $${fieldIndex++}`)
        updateValues.push(firstName)
    }

    if (lastName) {
        updateFields.push(`last_name = $${fieldIndex++}`)
        updateValues.push(lastName)
    }

    const updateQuery = `
            update users
            set ${updateFields.join(', ')}
            where email = $${fieldIndex}
            returning email, first_name, last_name
        `

    updateValues.push(req.user.email)
    const result = await db.query<Partial<TUser>>(updateQuery, updateValues)
    const user = result.rows?.[0]

    if (!user) {
        return res.status(400).json({
            status: 102,
            message: 'Data tidak ditemukan',
            data: null,
        })
    }

    return res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: user,
    })
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
            const query = `
                update users
                set profile_image = $1
                where
                    email = $2
                returning
                    email,
                    first_name,
                    last_name,
                    profile_image
            `
            const values = [uploadResult.secure_url, reqUser.email]
            const result = await db.query<Partial<TUser>>(query, values)
            const user = result.rows?.[0]

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