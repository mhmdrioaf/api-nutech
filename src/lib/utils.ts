import { Request, Response } from 'express'

const errorHandler = (_req: Request, res: Response) => {
    return res
        .status(500)
        .json({
            status: 404,
            message: 'Endpoint tidak ditemukan',
        })
}

export {
    errorHandler,
}