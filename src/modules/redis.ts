import { AsyncContainerModule } from 'inversify';
import { createClient } from '@node-redis/client';
import { RedisClientService } from '../redis';
import assert from '../util/assert';

const redis = new AsyncContainerModule(async bind => {
    assert(process.env.REDIS_HOST, 'REDIS_HOST must be defined');

    const client = createClient({
        url: `redis://${process.env.REDIS_HOST}:${
            process.env.REDIS_PORT || '6379'
        }`,
    });

    client.on('error', (error: unknown) => {
        throw error;
    });

    await client.connect();

    bind(RedisClientService).toConstantValue(client);
});

export default redis;
