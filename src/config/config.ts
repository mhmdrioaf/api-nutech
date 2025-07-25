import dotenv from 'dotenv'

dotenv.config()

interface IConfig {
    APP_HOST: string
    APP_PORT: number
    NODE_ENV: string

    JWT_SECRET: string
    JWT_EXP_TIME: number

    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    CLOUDINARY_CLOUD_NAME: string

    DB_HOST: string
    DB_PORT: number
    DB_USER: string
    DB_PASSWORD: string
    DB_DATABASE: string
}

const APP_HOST = process.env.APP_HOST ?? 'http://localhost'
const APP_PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000
const NODE_ENV = process.env.NODE_ENV ?? 'development'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXP_TIME = process.env.JWT_EXP_TIME ? Number(process.env.JWT_EXP_TIME) : 43200

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME

const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
const DB_USER = process.env.DB_USER ?? 'postgres'
const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
const DB_DATABASE = process.env.DB_DATABASE ?? 'postgres'

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
    APP_HOST,
    APP_PORT,
    NODE_ENV,

    JWT_SECRET,
    JWT_EXP_TIME,

    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME,

    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
}

export default config