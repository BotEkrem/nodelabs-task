declare module 'express-serve-static-core' {
    interface Request {
        user?: User
    }
}

export interface User {
    id: string,
    username: string,
    iat: number,
    exp: number
}