import { NextFunction, Request, Response } from 'express'

export function setError(error: Error, req: Request, res: Response, next: NextFunction) {

    if (!error)
        next()

    let statusCode = 0
    let msg = ''

    switch (error.name) {
        case 'SequelizeUniqueConstraintError':
        case 'SequelizeValidationError':
            statusCode = 409
            msg = error.message
            break
        case 'SequelizeConnectionError':
            statusCode = 500
            msg = 'Internal server error, ' + error.message
            break
        case 'Error':
            statusCode = 404
            msg = error.message
            break
        default:
            statusCode = 400
            msg = error.message
            break
    }

    return res.status(statusCode).json({ message: msg })

}