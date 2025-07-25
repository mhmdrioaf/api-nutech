import { Pool } from "pg"
import { ETransactionType } from "../../../lib/constants"
import { v4 as uuidv4 } from "uuid"

interface IServicePaymentStatus {
    status: number
    message: string
    data: Partial<TTransactionHistory> | null
}

export class Transaction {
    private db: Pool
    constructor(_db: Pool) {
        this.db = _db
    }

    async topup(userEmail: string, topup_balance: number) {
        try {
            const query = await this.db.query<TWallet>(`
                select
                    uw.*
                from users_wallet uw
                join users u on
                    u.email = $1
                    and u.id = uw.owner_id
            `, [userEmail])
            const userWallet = query.rowCount ? query.rows[0] : null

            if (userWallet) {
                const addBalance = this.db.query<Partial<TWallet>>(`
                    update users_wallet
                    set balance = balance + $1
                    where id = $2
                    returning balance
                `, [topup_balance, userWallet.id])

                const addTransactionHistory = this.db.query<TTransactionHistory>(`
                    insert into transaction_history (invoice_number, transaction_type, description, total_amount, wallet_id)
                    values ($1, $2, $3, $4, $5)
                `, [uuidv4(), ETransactionType.TOP_UP, 'Top Up balance', topup_balance, userWallet.id])

                const [walletResult, _transactionResult] = await Promise.all([addBalance, addTransactionHistory])
                const updatedWallet = walletResult.rowCount ? walletResult.rows[0] : null

                if (updatedWallet) {
                    return {
                        balance: Number(updatedWallet.balance)
                    }
                } else {
                    return null
                }
            }

            return null
        } catch (err) {
            console.error('[TRANSACTION] terjadi kesalahan ketika melakukan top up: ', err)
            return null
        }
    }

    async payService(userEmail: string, service_code: string): Promise<IServicePaymentStatus> {
        try {
            const serviceQuery = await this.db.query<TService>(`
                select * from services
                where
                    service_code = $1    
            `, [service_code])
            const service = serviceQuery.rowCount ? serviceQuery.rows[0] : null

            if (!service) {
                return {
                    status: 102,
                    message: 'Service atau Layanan tidak ditemukan',
                    data: null,
                }
            }

            const serviceCost = Number(service.service_tarif)
            
            const userWalletQuery = await this.db.query<TWallet>(`
                select
                    uw.*
                from users_wallet uw
                join users u on
                    u.email = $1
                    and u.id = uw.owner_id
            `, [userEmail])
            const userWallet = userWalletQuery.rowCount ? userWalletQuery.rows[0] : null

            if (!userWallet) {
                return {
                    status: 102,
                    message: 'Dompet pengguna tidak ditemukan',
                    data: null,
                }
            }

            const totalBalance = Number(userWallet.balance)

            if (totalBalance < serviceCost) {
                return {
                    status: 102,
                    message: 'Saldo tidak mencukupi',
                    data: null,
                }
            }

            const updateUserWallet = this.db.query<TWallet>(`
                update users_wallet
                set balance = balance - $1
                where
                    id = $2    
            `, [serviceCost, userWallet.id])

            const createTransactionHistory = this.db.query<Partial<TTransactionHistory>>(`
                insert into transaction_history (invoice_number, transaction_type, description, total_amount, wallet_id)
                values ($1, $2, $3, $4, $5)
                returning
                    invoice_number,
                    transaction_type,
                    description,
                    total_amount,
                    created_on
            `, [uuidv4(), ETransactionType.PAYMENT, service.service_name, service.service_tarif, userWallet.id])

            const [_userWalletResult, transactionResult] = await Promise.all([updateUserWallet, createTransactionHistory])
            const transaction = transactionResult.rowCount ? transactionResult.rows[0] : null

            if (!transaction) {
                return {
                    status: 500,
                    message: 'Internal server error',
                    data: null,
                }
            }

            transaction.total_amount = Number(transaction.total_amount)

            return {
                status: 0,
                message: 'Transaksi berhasil',
                data: transaction,
            }
        } catch (err) {
            console.error('[TRANSACTION] terjadi kesalahan ketika membayar layanan: ', err)
            return {
                status: 102,
                message: 'Internal server error',
                data: null,
            }
        }
    }

    async history(userEmail: string, offset: number = 0, limit: number | null) {
        let limitStatement = ''
        const values: any[] = []
        let fieldIndex = 1
        values.push(userEmail)
        fieldIndex++

        values.push(offset)
        fieldIndex++

        if (limit) {
            limitStatement = `limit $${fieldIndex}`
            values.push(limit)
        }

        const statements = `
            select
                th.invoice_number,
                th.transaction_type,
                th.description,
                th.total_amount,
                th.created_on
            from users_wallet uw
            join users u on
                u.id = uw.owner_id
                and u.email = $1
            join transaction_history th on
                th.wallet_id = uw.id
            order by th.created_on desc
            offset $2
            ${limitStatement}
        `
        
        const query = await this.db.query<Partial<TTransactionHistory>>(statements, values)
        const userTransactions = query.rows
        userTransactions.forEach(transaction => transaction.total_amount = Number(transaction.total_amount))

        return userTransactions
    }
}