type TUser = {
    id: number
    email: string
    first_name: string
    last_name: string
    password: string
    profile_image: string | null
    wallet: TWallet | null
}

type TWallet = {
    id: number,
    balance: number,

    owner: TUser,
    owner_id: number
}

type TBanner = {
    id: number
    banner_name: string
    banner_image: string
    description: string
}

type TService = {
    id: number
    service_code: string
    service_name: string
    service_icon: string
    service_tarif: number
}

type TTransactionHistory = {
    id: number
    invoice_number: string
    transaction_type: string
    description: string
    total_amount: number
    created_on: Date
    wallet_id: number
    wallet: TWallet
}