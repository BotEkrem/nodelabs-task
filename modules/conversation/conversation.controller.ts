import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import {ConversationService} from "@/modules/conversation/conversation.service";
import {bodyValidationMiddleware} from "@/middlewares/bodyvalidation.middleware";

const router = express.Router();

router.post('/create', bodyValidationMiddleware<ConversationService>, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const participantMe = req.user.id;
        const {participant} = req.body;

        const conversation = await ConversationService.createOrFindConversation(participantMe, participant);
        res.status(201).json(conversation);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;

        const conversations = await ConversationService.getUserConversations(userId);
        res.json(conversations);
    } catch (err) {
        next(err);
    }
});

export default router;
