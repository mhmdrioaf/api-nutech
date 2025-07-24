import dotenv from 'dotenv'

dotenv.config()

interface IConfig {
    APP_PORT: number
    NODE_ENV: string
    JWT_SECRET: string
    JWT_EXP_TIME: number
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    CLOUDINARY_CLOUD_NAME: string
}

const APP_PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXP_TIME = process.env.JWT_EXP_TIME ? Number(process.env.JWT_EXP_TIME) : 43200
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET tidak ditemukan!')
}

if (!CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY tidak ditemukan!')
}
if (!CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET tidak ditemukan!')
}
if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME tidak ditemukan!')
}

const config: IConfig = {
    APP_PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXP_TIME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME,
}

export default config