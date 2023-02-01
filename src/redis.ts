import type { createClient } from '@node-redis/client';

export type RedisClient = ReturnType<typeof createClient>;

export const RedisClientService = Symbol.for('RedisClient');

export const RedisSubscriberClientService = Symbol.for('RedisSubscriberClient');
