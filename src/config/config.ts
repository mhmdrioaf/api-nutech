import dotenv from 'dotenv'

dotenv.config()

interface IConfig {
    APP_PORT: number
    NODE_ENV: string
}

const APP_PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000
const NODE_ENV = process.env.NODE_ENV ?? 'development'

const config: IConfig = {
    APP_PORT,
    NODE_ENV,
}

export default config