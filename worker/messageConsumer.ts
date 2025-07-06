import * as amqp from 'amqplib';
import {Message} from '@/models/Message';
import {AutoMessage} from '@/models/AutoMessage';
import {ConversationService} from "@/modules/conversation/conversation.service";
import {io} from "@/socket/instance";

const QUEUE_NAME = 'message_sending_queue';

export async function startMessageConsumer() {
    const connection = await amqp.connect('amqp://rabbitmq:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);

    console.log('Consumer listening on', QUEUE_NAME);

    channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString());
            const {id, sender, receiver, content} = data;

            const conversation = await ConversationService.createOrFindConversation(sender, receiver);

            const newMessage = await Message.create({
                sender,
                conversation: conversation._id,
                content,
                isRead: false,
            });

            await AutoMessage.findByIdAndUpdate(id, {
                isSent: true,
            });

            io.to(conversation._id.toString()).emit('message_received', {
                conversationId: conversation._id,
                senderId: sender,
                content,
                messageId: newMessage._id,
                createdAt: newMessage.createdAt,
            });

            channel.ack(msg);
        } catch (err) {
            console.error('Consumer error:', err);
            channel.nack(msg);
        }
    });
}
