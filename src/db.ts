import knex, { Knex } from 'knex';
import config from '../knexfile';
import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
export const db: Knex = knex((config as any)[env]);

process.on('SIGINT', async () => {
    await db.destroy();
    process.exit(0);
});
