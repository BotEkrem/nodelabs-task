import {createClient} from "redis";

export const redis = createClient({
    url: 'redis://redis:6379'
});

export async function connectRedis() {
    await redis.connect().then(() => {
        console.log("Redis connected.")
    });
}