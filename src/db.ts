import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASS || 'postgres',
    host: process.env.DATABASE_HOST || 'database',
    database: process.env.DATABASE_NAME || 'message_database',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
});

export const query = async (text: string, params?: any[]) => {
    return await pool.query(text, params);
};
