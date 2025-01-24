import Redis from "ioredis";

const redisClient = new Redis();

redisClient.on("connect", () => console.log("Connected to Redis"));

export default redisClient;
