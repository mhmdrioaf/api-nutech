import { Schema } from "express-validator";

export const registerDto: Schema = {
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Parameter email tidak sesuai format'
        },
        errorMessage: 'Parameter email harus diisi',
    },
    first_name: {
        in: ['body'],
        isString: true,
        errorMessage: 'Parameter first_name harus diisi'
    },
    last_name: {
        in: ['body'],
        isString: true,
        errorMessage: 'Parameter last_name harus diisi',
    },
    password: {
        in: ['body'],
        isString: true,
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: 'Password length minimal 8 karakter'
        },
        errorMessage: 'Parameter password harus diisi'
    }
}