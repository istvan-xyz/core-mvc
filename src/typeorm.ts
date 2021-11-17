import { AsyncContainerModule } from 'inversify';
import { readFileSync } from 'fs';
import { createConnection, Connection } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const ormConfig: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logger: unknown;
    // eslint-disable-next-line import/no-dynamic-require
} = JSON.parse(readFileSync(`${process.cwd()}/ormconfig.json`).toString());

const typeorm = new AsyncContainerModule(async bind => {
    bind<Connection>(Connection).toConstantValue(
        await createConnection(ormConfig as PostgresConnectionOptions)
    );
});

export default typeorm;
