import Redis from 'ioredis';
import logger from './logger';

const redisClient = new Redis({
  host: 'redis',
  port: 6379,
});

redisClient.on('connect', () => logger.info('Connected to Redis'));

export default redisClient;
