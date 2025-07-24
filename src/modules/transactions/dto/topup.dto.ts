import { Schema } from "express-validator";

const topupDto: Schema = {
    top_up_amount: {
        in: ['body'],
        isInt: {
            errorMessage: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
            options: {
                min: 1,
            }
        },
        errorMessage: 'Parameter top_up_amount tidak boleh kosong'
    }
}

export default topupDto