import { Schema } from "express-validator";

export const profileUpdateDto: Schema = {
    first_name: {
        in: ['body'],
        isString: true,
        optional: true,
    },
    last_name: {
        in: ['body'],
        isString: true,
        optional: true,
    },
}