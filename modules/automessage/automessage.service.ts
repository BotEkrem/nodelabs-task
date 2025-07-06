import {AutoMessage} from '@/models/AutoMessage';
import {User} from '@/models/User';

export class AutoMessageService {
    static async createDailyMatches() {
        const users = await User.find();

        if (users.length < 2) {
            console.warn('Not enough user count.');
            return;
        }

        const shuffledUsers = this.shuffleArray(users);

        for (let i = 0; i < shuffledUsers.length; i += 2) {
            const userA = shuffledUsers[i];
            const userB = shuffledUsers[i + 1];
            if (!userB) continue;

            const messageTime = this.getRandomTomorrowTime();

            const messages = [
                {
                    sender: userA._id,
                    receiver: userB._id,
                    content: `randomgeneratedmessage`,
                    sendDate: messageTime,
                    isQueued: false,
                    isSent: false,
                },
            ];

            await AutoMessage.insertMany(messages);
        }

        console.log('AutoMessages created.');
    }

    private static shuffleArray<T>(array: T[]) {
        return array
            .map((value) => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value);
    }

    private static getRandomTomorrowTime() {
        const date = new Date();
        date.setDate(date.getDate() + 1);

        const hour = Math.floor(Math.random() * (21 - 9 + 1)) + 9;
        const minute = Math.floor(Math.random() * 60);

        date.setHours(hour, minute, 0, 0);
        return date;
    }
}
