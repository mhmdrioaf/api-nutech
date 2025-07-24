import { NextFunction, Request, Response } from "express"
import { JWTAuth } from "../../../lib/jwt"

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kedaluwarsa',
            data: null,
        })
    }

    const jwt = new JWTAuth()
    const jwtPayload = jwt.verifyToken(token)

    if (jwtPayload) {
        req.user = jwtPayload

        next()
    } else {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kedaluwarsa',
            data: null,
        })
    }
}

export default authMiddleware