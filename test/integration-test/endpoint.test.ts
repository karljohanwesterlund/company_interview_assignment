import request from 'supertest';
import app from '../../src/app';
import type { Knex } from 'knex';
import { database } from '../../src/database';

beforeAll(async () => {
    if (database.client.config.client !== 'sqlite3') {
        // Ensure we run tests against the sqlite test db
        process.exit(1);
    }
    await database.migrate.latest();
});
afterAll(async () => {
    await database('messages').truncate();
    await database.destroy();
});

describe('GET /messages/:id', () => {
    it('should return 404 if there is no messages', async () => {
        await database('messages').truncate();
        const result = await request(app).get('/messages/0');
        expect(result.status).toBe(404);
    });

    it('should return 200 and the DB message if message exists', async () => {
        const [message, palindrome, created_at, updated_at] = ['abc', true, new Date().getTime(), new Date().getTime()];
        const createdEntry = await database('messages').insert({ message, palindrome, created_at, updated_at }).returning('*');
        const createdEntryId = createdEntry[0].id;

        const result = await request(app).get(`/messages/${createdEntryId}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual({ id: createdEntryId, message, palindrome: 1, created_at, updated_at });
    });
});

describe('POST /messages', () => {
    it('should return 400 if there is no message body', async () => {
        const result = await request(app).post('/messages').send({});
        expect(result.status).toBe(400);
        expect(result.text).toBe('{"error":"\'message\' must exist."}');
    });

    it('should return 200 and the DB message', async () => {
        const message = 'Hi';
        const result = await request(app).post('/messages').send({ message });
        expect(result.status).toBe(200);

        const returnValue = JSON.parse(result.text);
        expect(returnValue.id).toBeDefined();
        expect(returnValue.message).toBe(message);
        expect(returnValue.palindrome).toBeFalsy();
        expect(returnValue.created_at).toBeDefined();
        expect(returnValue.updated_at).toBeDefined();
    });
});
