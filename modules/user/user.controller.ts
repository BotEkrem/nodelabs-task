import * as express from "express";
import {Request, Response, NextFunction} from "express";
import {UserService} from "@/modules/user/user.service";
import {redis} from "@/db/redis";

const router = express.Router()

router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
    res.json(await (UserService.list()))
});

router.get('/online', async (req, res) => {
    const onlineUsers = await redis.sMembers('online_users');
    res.json({count: (onlineUsers as any[]).length, users: onlineUsers});
});

export default router;