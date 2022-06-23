import { AsyncContainerModule } from 'inversify';
import { readFileSync } from 'fs';
import { DataSource } from 'typeorm';
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
    const dataSource = new DataSource(ormConfig as PostgresConnectionOptions);
    await dataSource.initialize();

    bind<DataSource>(DataSource).toConstantValue(dataSource);
});

export default typeorm;
