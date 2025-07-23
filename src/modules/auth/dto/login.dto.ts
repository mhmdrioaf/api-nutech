import { Schema } from "express-validator";

export const loginDto: Schema = {
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Parameter email tidak sesuai format',
        },
        errorMessage: 'Parameter email harus diisi',
    },
    password: {
        in: ['body'],
        isString: true,
        errorMessage: 'Parameter password harus diisi'
    }
}