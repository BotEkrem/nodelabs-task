import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";

import {User as ReqUser} from "@/types/express";
import {User} from "@/models/User";

export const whiteListedEndpoints = [
    "/api/auth/login",
    "/api/auth/register"
]

export async function jwtSessionMiddleware(req: Request, res: Response, next: NextFunction) {
    if (whiteListedEndpoints.includes(req.path)) return next()

    const authArray = req.headers.authorization?.split(" ") as any[] || [""]

    if (authArray[0] !== "Bearer" || authArray[3]) {
        return res.status(401).json({
            "message": "Unauthorized"
        })
    } else {
        const decodedData = await jwtVerification(req.headers.authorization?.split(" ")[1] as string, req.ip).catch((e) => {
            res.status(401).json({
                "message": "Unauthorized"
            })
        })

        req.user = decodedData as ReqUser
        if (decodedData) return next()
    }
}

export async function jwtVerification(jwtHash: string, ip: string): Promise<jwt.JwtPayload> {
    return new Promise(async (resolve, reject) => {
        try {
            const data = jwt.verify(jwtHash, process.env.JWT_SECRET as string) as jwt.JwtPayload
            const userData = await User.findById(data.id)
            if (userData && userData.loginAt && ip === userData.loginIP) {
                resolve(data)
            } else {
                reject("NotValid")
            }
        } catch (err) {
            reject(err)
        }
    })
}