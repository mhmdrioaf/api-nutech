import * as jwt from 'jsonwebtoken'
import config from '../config/config'
import { JWTPayload } from '../@types/express'

export interface IJWTPayload {
    email: string
}

export class JWTAuth {
    private payload: IJWTPayload | undefined
    
    constructor(payload?: IJWTPayload) {
        this.payload = payload
    }

    generateToken(): string {
        if (!this.payload) {
            throw new Error('JWT Payload belum diset')
        }

        return jwt.sign(this.payload, config.JWT_SECRET, { expiresIn: config.JWT_EXP_TIME })
    }

    verifyToken(token: string) {
        try {
            const cleanToken = token.split(' ')[1]
            const payload = jwt.verify(cleanToken, config.JWT_SECRET) as JWTPayload

            return payload
        } catch (err) {
            console.error('[JWT] Terjadi kesalahan ketika verifikasi token: ', err)

            return null
        }
    }
}