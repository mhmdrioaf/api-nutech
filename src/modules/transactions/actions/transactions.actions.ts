import { Prisma, PrismaClient } from "../../../generated/prisma"
import { ETransactionType } from "../../../lib/constants"
import { v4 as uuidv4 } from "uuid"

export class Transaction {
    private prismaService: PrismaClient
    constructor(prisma: PrismaClient) {
        this.prismaService = prisma
    }

    async topup (userEmail: string, topup_balance: number) {
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
}