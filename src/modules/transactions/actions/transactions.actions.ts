import { Prisma, PrismaClient, transaction_history } from "../../../generated/prisma"
import { ETransactionType } from "../../../lib/constants"
import { v4 as uuidv4 } from "uuid"

interface IServicePaymentStatus {
    status: number
    message: string
    data: Partial<transaction_history> | null
}

export class Transaction {
    private prismaService: PrismaClient
    constructor(prisma: PrismaClient) {
        this.prismaService = prisma
    }

    async topup(userEmail: string, topup_balance: number) {
        try {
            const userWallet = await this.prismaService.users_wallet.findFirst({
                where: {
                    owner: {
                        email: userEmail,
                    }
                }
            })

            if (userWallet) {
                const addBalance = this.prismaService.users_wallet.update({
                    where: {
                        id: userWallet.id,
                    },
                    data: {
                        balance: new Prisma.Decimal(userWallet.balance).plus(topup_balance),
                    }
                })

                const addTransactionHistory = this.prismaService.transaction_history.create({
                    data: {
                        wallet_id: userWallet.id,
                        transaction_type: ETransactionType.TOP_UP,
                        description: 'Top Up Balance',
                        invoice_number: uuidv4(),
                        total_amount: new Prisma.Decimal(topup_balance),

                    }
                })

                const results = await this.prismaService.$transaction([addBalance, addTransactionHistory])

                if (results && results.length) {
                    return {
                        balance: results[0].balance.toNumber()
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
            const service = await this.prismaService.services.findFirst({
                where: {
                    service_code,
                }
            })

            if (!service) {
                return {
                    status: 102,
                    message: 'Service atau Layanan tidak ditemukan',
                    data: null,
                }
            }

            const serviceCost = service.service_tarif.toNumber()
            
            const userWallet = await this.prismaService.users_wallet.findFirst({
                where: {
                    owner: {
                        email: userEmail,
                    }
                }
            })

            if (!userWallet) {
                return {
                    status: 102,
                    message: 'Dompet pengguna tidak ditemukan',
                    data: null,
                }
            }

            const totalBalance = userWallet.balance.toNumber()

            if (totalBalance < serviceCost) {
                return {
                    status: 102,
                    message: 'Saldo tidak mencukupi',
                    data: null,
                }
            }

            const updateUserWallet = this.prismaService.users_wallet.update({
                where: {
                    id: userWallet.id,
                },
                data: {
                    balance: userWallet.balance.minus(service.service_tarif)
                }
            })

            const createTransactionHistory = this.prismaService.transaction_history.create({
                data: {
                    invoice_number: uuidv4(),
                    total_amount: service.service_tarif,
                    transaction_type: ETransactionType.PAYMENT,
                    description: service.service_name,
                    wallet_id: userWallet.id,
                },
                omit: {
                    id: true,
                    wallet_id: true,
                }
            })

            const [_userWalletResult, transactionResult] = await this.prismaService.$transaction([updateUserWallet, createTransactionHistory])

            if (!transactionResult) {
                return {
                    status: 500,
                    message: 'Internal server error',
                    data: null,
                }
            }

            return {
                    status: 0,
                    message: 'Transaksi berhasil',
                    data: transactionResult,
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
}