import {Conversation} from '@/models/Conversation';

export class ConversationService {
    static async createOrFindConversation(participantA: string, participantB: string) {
        if (participantA == participantB) {
            const err: any = new Error("You cannot create conversation with yourself.");
            err.status = 400;
            throw err;
        }

        const existing = await Conversation.findOne({
            participants: {$all: [participantA, participantB]},
        });

        if (existing) return existing;

        return await Conversation.create({
            participants: [participantA, participantB],
        });
    }

    static async getUserConversations(userId: string) {
        return Conversation.find({participants: userId}).populate('participants', 'username');
    }
}
