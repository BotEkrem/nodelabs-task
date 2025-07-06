import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import {MessageService} from "@/modules/message/message.service";
import {bodyValidationMiddleware} from "@/middlewares/bodyvalidation.middleware";
import {SendMessageDto} from "@/dto/message/sendmessage.dto";

const router = express.Router();

router.post('/send', bodyValidationMiddleware<SendMessageDto>, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const senderId = req.user.id;
        const {conversationId, content} = req.body;

        const message = await MessageService.sendMessage(senderId, conversationId, content);
        res.status(201).json(message);
    } catch (err) {
        next(err);
    }
});

router.get('/:conversationId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {conversationId} = req.params;
        const userId = req.user.id;

        const messages = await MessageService.getMessagesByConversation(conversationId, userId);
        res.json(messages);
    } catch (err) {
        next(err);
    }
});

router.put('/:messageId/read', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {messageId} = req.params;
        const userId = req.user.id;

        const updated = await MessageService.markMessageAsRead(messageId, userId);
        res.json(updated);
    } catch (err) {
        next(err);
    }
});

export default router;