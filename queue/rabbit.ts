import * as amqp from 'amqplib';

let channel: amqp.Channel;

const QUEUE_NAME = 'message_sending_queue';

export async function initRabbit(): Promise<void> {
    const connection = await amqp.connect('amqp://rabbitmq:5672');
    const ch = await connection.createChannel();
    await ch.assertQueue(QUEUE_NAME);
    channel = ch;
}

export function publishToQueue(data: any) {
    if (!channel) throw new Error('RabbitMQ channel not initialized');
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)));
}