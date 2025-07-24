import { IJWTPayload } from "../../lib/jwt";

interface JWTPayload extends IJWTPayload {
    iat: number
    exp: number
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload,
        }        
    }
}