import {Request, Response, NextFunction} from 'express';

export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.status || 500;

    const isDev = process.env.NODE_ENV === 'development';

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        ...(isDev && {stack: err.stack}),
        ...(err.details && {details: err.details})
    });
}
