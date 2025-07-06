import {Message} from "@/models/Message";
import {Conversation} from "@/models/Conversation";

export class MessageService {
    static async sendMessage(senderId: string, conversationId: string, content: string) {
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            const err = new Error('Conversation not found');
            (err as any).status = 404;
            throw err;
        }

        const isParticipant = conversation.participants.some(
            (participant) => participant.toString() === senderId
        );

        if (!isParticipant) {
            const err = new Error('You are not a participant in this conversation');
            (err as any).status = 403;
            throw err;
        }

        return await Message.create({
            sender: senderId,
            conversation: conversationId,
            content,
        });
    }

    static async getMessagesByConversation(conversationId: string, userId: string) {
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            const err = new Error('Conversation not found');
            (err as any).status = 404;
            throw err;
        }

        const isParticipant = conversation.participants.some(
            (id) => id.toString() === userId
        );

        if (!isParticipant) {
            const err = new Error('Unauthorized to view this conversation');
            (err as any).status = 403;
            throw err;
        }

        return Message.find({conversation: conversationId})
            .sort({createdAt: 1})
            .populate('sender', 'username');
    }

    static async markMessageAsRead(messageId: string, userId: string) {
        const message = await Message.findById(messageId);

        if (!message) {
            const err = new Error('Message not found');
            (err as any).status = 404;
            throw err;
        }

        if (message.sender.toString() === userId) {
            const err = new Error('You cannot mark your own message as read');
            (err as any).status = 403;
            throw err;
        }

        const conversation = await Conversation.findById(message.conversation);
        const isParticipant = conversation?.participants.some(
            (id) => id.toString() === userId
        );

        if (!isParticipant) {
            const err = new Error('Unauthorized access to this message');
            (err as any).status = 403;
            throw err;
        }

        return Message.findByIdAndUpdate(
            messageId,
            {isRead: true},
            {new: true}
        );
    }
}
