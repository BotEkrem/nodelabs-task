import cron from 'node-cron';
import {AutoMessage} from '@/models/AutoMessage';
import {publishToQueue} from "@/queue/rabbit";
import {module_check} from "@/main";

if (module_check("BASE")) {
    console.log("Checker Cron initiated.")

    cron.schedule('* * * * *', async () => {
        console.log(`Checking AutoMessages... - ${new Date().toISOString()}`);

        const messages = await AutoMessage.find({
            isQueued: false,
            isSent: false,
            sendDate: {$lte: new Date()},
        });

        for (const msg of messages) {
            publishToQueue({
                id: msg._id,
                sender: msg.sender,
                receiver: msg.receiver,
                content: msg.content,
            });

            msg.isQueued = true;
            await msg.save();
            console.log(`A AutoMessage sent to the queue. - ${new Date().toISOString()}`);
        }

        console.log(`Checked AutoMessages. - ${new Date().toISOString()}`);
    });
}