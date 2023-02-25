import { AsyncContainerModule } from 'inversify';
import { createClient } from '@redis/client';
import { RedisClientService, RedisSubscriberClientService } from '../redis';
import assert from '../util/assert';

const redis = new AsyncContainerModule(async bind => {
    const createRedisClient = async () => {
        assert(process.env.REDIS_HOST, 'REDIS_HOST must be defined');

        const client = createClient({
            url: `redis://${process.env.REDIS_HOST}:${
                process.env.REDIS_PORT || '6379'
            }`,
            socket: {
                reconnectStrategy(retries: number) {
                    if (retries < 60) {
                        return 1_000;
                    }

                    return new Error('No retries left');
                },
            },
        });

        client.on('error', (error: unknown) => {
            throw error;
        });

        await client.connect();
        return client;
    };

    bind(RedisClientService).toConstantValue(await createRedisClient());
    bind(RedisSubscriberClientService).toConstantValue(
        await createRedisClient()
    );
});

export default redis;
