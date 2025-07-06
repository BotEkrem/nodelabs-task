import * as http from 'http';
import * as express from "express";
import * as dotenv from "dotenv";
import * as passport from "passport";
import * as bodyParser from "body-parser";

dotenv.config();
export const MODULE_NAME = process.env.MODULE;

import {jwtSessionMiddleware} from "@/middlewares/jwtsession.middleware";
import {errorHandlerMiddleware} from "@/middlewares/error.middleware";
import passportStrategy from "@/strategy/passport.strategy";

import AuthController from "@/modules/auth/auth.controller";
import UserController from "@/modules/user/user.controller";
import MessageController from "@/modules/message/message.controller";
import ConversationController from "@/modules/conversation/conversation.controller";

import {initSocketServer} from "@/socket/socket";
import {initRabbit} from "@/queue/rabbit";
import {connectDB} from "@/db/database";
import {connectRedis} from "@/db/redis";
import {startMessageConsumer} from "@/worker/messageConsumer";

import '@/cron/dailyMatch';
import '@/cron/autoMessagePublisher';

passportStrategy(passport);

const app = express();
const port = process.env.PORT as unknown as number;
const server = http.createServer(app);

export function module_check(name: string) {
    return MODULE_NAME === name || MODULE_NAME === "GENERAL";
}

app.use(bodyParser.json())
app.use(jwtSessionMiddleware)

if (module_check("AUTH")) app.use("/api/auth", AuthController)
if (module_check("USER")) app.use("/api/user", UserController)
if (module_check("MESSAGES")) app.use('/api/messages', MessageController);
if (module_check("CONVERSATIONS")) app.use('/api/conversations', ConversationController);

app.use(errorHandlerMiddleware);

if (module_check("BASE")) initSocketServer(server);
if (module_check("BASE")) initRabbit();
if (module_check("BASE")) startMessageConsumer();

connectDB();
connectRedis();

server.listen(port, '0.0.0.0', () => {
    console.log(`App listening on http://0.0.0.0:${port}`);
});