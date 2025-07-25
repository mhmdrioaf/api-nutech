import { Pool } from 'pg'
import config from '../config/config'

let db: Pool

if (config.NODE_ENV === 'development') {
    db = new Pool({
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE,
    })
} else {
    db = new Pool({
        connectionString: config.DB_URL
    })
}


export default db