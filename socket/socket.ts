import {Server} from 'socket.io';
import {Conversation} from '@/models/Conversation';
import {Message} from '@/models/Message';
import {redis} from "@/db/redis";
import {jwtVerification} from "@/middlewares/jwtsession.middleware";
import {setSocketIO} from "@/socket/instance";

export const initSocketServer = async (server: any) => {
    const io = new Server(server, {cors: {origin: '*'}});
    setSocketIO(io)

    io.use(async (socket, next) => {
        const token = socket.handshake.auth?.token;
        const ip = socket.handshake.address.includes("127.0.0.1") ? "::1" : socket.handshake.address;

        if (!token) {
            return next(new Error('Unauthorized: No token provided'));
        }

        try {
            const decoded = await jwtVerification(token, ip);
            (socket as any).userId = decoded.id;
            (socket as any).user = decoded;
            next();
        } catch (err) {
            next(new Error('Unauthorized: Invalid or expired token'));
        }
    });

    io.on('connection', async (socket) => {
        const userId = (socket as any).userId;
        console.log(`User connected: ${userId}`);

        await redis.sAdd('online_users', userId);
        socket.broadcast.emit('user_online', {userId});

        socket.on('join_room', async (conversationId: string) => {
            const conversation = await Conversation.findById(conversationId);
            const isParticipant = conversation?.participants.some((id) => id.toString() === userId);

            if (!isParticipant) {
                socket.emit('error', {message: 'Unauthorized to join room'});
                return;
            }

            socket.join(conversationId);
            socket.emit('joined_room', {room: conversationId});
        });

        socket.on('send_message', async (data: { conversationId: string; content: string }) => {
            const {conversationId, content} = data;

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return socket.emit('error', {message: 'Conversation not found'});
            }

            const isParticipant = conversation.participants.some(
                (id) => id.toString() === userId
            );
            if (!isParticipant) {
                return socket.emit('error', {message: 'Unauthorized to send message'});
            }

            const message = await Message.create({
                sender: userId,
                conversation: conversationId,
                content,
            });

            socket.to(conversationId).emit('message_received', {
                conversationId,
                content,
                senderId: userId,
                messageId: message._id,
                createdAt: message.createdAt,
            });

            socket.emit('message_sent', {
                conversationId,
                messageId: message._id,
                createdAt: message.createdAt,
                content,
            });
        });

        socket.on('typing', ({conversationId}) => {
            socket.to(conversationId).emit('typing', {
                conversationId,
                userId,
            });
        });

        socket.on('stop_typing', ({conversationId}) => {
            socket.to(conversationId).emit('stop_typing', {
                conversationId,
                userId,
            });
        });

        socket.on('message_read', async ({conversationId, messageId}) => {
            try {
                const userId = (socket as any).userId;

                const message = await Message.findById(messageId);
                if (!message) {
                    return socket.emit('error', {message: 'Message not found'});
                }

                if (message.sender.toString() === userId) {
                    return socket.emit('error', {message: 'You cannot mark your own message as read'});
                }

                const conversation = await Conversation.findById(conversationId);
                if (!conversation) {
                    return socket.emit('error', {message: 'Conversation not found'});
                }

                const isParticipant = conversation.participants.some(
                    (id) => id.toString() === userId
                );

                if (!isParticipant) {
                    return socket.emit('error', {message: 'Unauthorized'});
                }

                await Message.findByIdAndUpdate(messageId, {isRead: true});

                socket.to(conversationId).emit('message_read', {
                    conversationId,
                    messageId,
                    readerId: userId,
                });
            } catch (err) {
                socket.emit('error', {message: 'Read status update failed'});
            }
        });

        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${userId}`);
            await redis.sRem('online_users', userId);
            socket.broadcast.emit('user_offline', {userId});
        });
    });
};
