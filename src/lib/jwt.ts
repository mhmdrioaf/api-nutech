import * as jwt from 'jsonwebtoken'
import config from '../config/config'

export interface IJWTPayload {
    email: string
}

export class JWTAuth {
    private payload: IJWTPayload
    
    constructor(payload: IJWTPayload) {
        this.payload = payload
    }

    generateToken(): string {
        return jwt.sign(this.payload, config.JWT_SECRET, { expiresIn: config.JWT_EXP_TIME })
    }
}