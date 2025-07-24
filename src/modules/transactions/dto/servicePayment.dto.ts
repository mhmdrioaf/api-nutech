import { Schema } from "express-validator";

export const servicePaymentDto: Schema = {
    service_code: {
        in: ['body'],
        isString: true,
        errorMessage: 'Parameter service_code tidak boleh kosong',
    }
}