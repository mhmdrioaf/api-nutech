import dotenv from 'dotenv'

dotenv.config()

interface IConfig {
    APP_PORT: number
    NODE_ENV: string
    JWT_SECRET: string
    JWT_EXP_TIME: number
}

const APP_PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXP_TIME = process.env.JWT_EXP_TIME ? Number(process.env.JWT_EXP_TIME) : 43200

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET tidak ditemukan!')
}

const config: IConfig = {
    APP_PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXP_TIME,
}

export default config