import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const shared: Partial<Knex.Config> = {
    migrations: {
        directory: './migrations',
        extension: 'ts',
    },
    seeds: {
        directory: './seeds',
        extension: 'ts',
    },
};

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        },
        ...shared,
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: './test/integration-test/testDatabase.sqlite',
        },
        useNullAsDefault: true,
        migrations: {
            directory: './migrations',
            extension: 'ts',
        },
    },
    production: {
        client: 'pg',
        connection: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        },
        pool: { min: 2, max: 10 },
        ...shared,
    },
};

export default config;
