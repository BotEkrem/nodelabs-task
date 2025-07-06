import {dtos} from "@/dto";
import {Request, Response, NextFunction} from "express";
import {validationCheck} from "@/misc/functions/validation";


export async function bodyValidationMiddleware<T>(req: Request, res: Response, next: NextFunction) {
    const url = req.baseUrl.slice(1)
    const dto = new dtos[req.method == "POST" ? url : req.method == "PUT" ? url + "update" : url + "delete"]()

    Object.keys(req.body).forEach((k) => {
        dto[k] = req.body[k]
    })

    const dataCheck = await validationCheck<T>(dto)

    if (Object.keys(dataCheck).includes("errors")) {
        res.status(422).json(dataCheck)
    } else {
        next()
    }
}