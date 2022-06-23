import type { createClient } from '@node-redis/client';

type RedisClient = ReturnType<typeof createClient>;

export const RedisClientService = Symbol.for('RedisClient');

export default RedisClient;
