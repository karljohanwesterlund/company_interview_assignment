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

        const createdMessage = (await database('messages').select('*').where({ id: returnValue.id }))[0];
        expect(createdMessage.id).toBe(returnValue.id);
        expect(createdMessage.message).toBe(message);
        expect(createdMessage.palindrome).toBeFalsy();
        expect(createdMessage.created_at).toBeDefined();
        expect(createdMessage.updated_at).toBeDefined();
    });
});

describe('PATCH /messages/:id', () => {
    it('should return 400 if the id in query is not a number', async () => {
        const result = await request(app).patch('/messages/test').send();
        expect(result.status).toBe(400);
        expect(result.text).toBe('{"error":"\'id\' must exist or be a number."}');
    });

    it('should return 400 if there is no message in body', async () => {
        const result = await request(app).patch('/messages/0').send({});
        expect(result.status).toBe(400);
        expect(result.text).toBe('{"error":"\'message\' must exist."}');
    });

    it('should return 404 if the message does not exist', async () => {
        const id: number = 0;
        const result = await request(app).patch(`/messages/${id}`).send({ message: '123 123' });
        expect(result.status).toBe(404);
        expect(result.text).toBe(`{"error":"Message with id ${id} not found."}`);
    });

    it('should return 200 and the DB message on successful request', async () => {
        const [message, palindrome, created_at, updated_at] = ['abc', false, new Date(0).getTime(), new Date(0).getTime()];
        const createdEntry = await database('messages').insert({ message, palindrome, created_at, updated_at }).returning('*');
        const createdEntryId = createdEntry[0].id;
        const newMessage = 'aabaa';

        const result = await request(app).patch(`/messages/${createdEntryId}`).send({ message: newMessage });
        expect(result.status).toBe(200);
        const returnValue = JSON.parse(result.text);
        expect(returnValue.id).toBe(createdEntryId);
        expect(returnValue.message).toBe(newMessage);
        expect(returnValue.palindrome).toBeTruthy();
        expect(returnValue.created_at).toBeDefined();
        expect(returnValue.updated_at).toBeGreaterThan(returnValue.created_at);

        const updatedMessage = (await database('messages').select('*').where({ id: createdEntryId }))[0];
        expect(updatedMessage.message).toBe(newMessage);
        expect(updatedMessage.updated_at).toBe(returnValue.updated_at);
    });
});

describe('DELETE /messages/:id', () => {
    it('should return 400 if the id in query is not a number', async () => {
        const result = await request(app).delete('/messages/test');
        expect(result.status).toBe(400);
        expect(result.text).toBe('{"error":"\'id\' must exist or be a number."}');
    });

    it('should return 200 and the DB message', async () => {
        const [message, palindrome, created_at, updated_at] = ['abc', true, new Date(0).getTime(), new Date(0).getTime()];
        const createdEntry = await database('messages').insert({ message, palindrome, created_at, updated_at }).returning('*');
        const createdEntryId = createdEntry[0].id;
        const result = await request(app).delete(`/messages/${createdEntryId}`).send({ message });
        expect(result.status).toBe(200);

        const returnValue = JSON.parse(result.text);
        expect(returnValue.id).toBeDefined();
        expect(returnValue.message).toBe(message);
        expect(returnValue.palindrome).toBeTruthy();
        expect(returnValue.created_at).toBeDefined();
        expect(returnValue.updated_at).toBeDefined();

        const deletedMessage = (await database('messages').select('*').where({ id: createdEntryId }))[0];
        expect(deletedMessage).toBeUndefined;
    });
});

describe('GET /messages', () => {
    it('should return an emplty list if there is no messages', async () => {
        await database('messages').truncate();
        const result = await request(app).get('/messages');
        expect(result.status).toBe(200);
        const returnValue = JSON.parse(result.text);
        expect(returnValue.length).toBe(0);
        expect(returnValue).toStrictEqual([]);
    });

    it('should return 200 and a list of messages', async () => {
        await database('messages').truncate();
        const [message1, palindrome1, created_at1, updated_at1] = ['abc', true, new Date().getTime(), new Date().getTime()];
        const [message2, palindrome2, created_at2, updated_at2] = ['dfg', false, new Date(3).getTime(), new Date(3).getTime()];
        const createdEntry1 = await database('messages')
            .insert({ message: message1, palindrome: palindrome1, created_at: created_at1, updated_at: updated_at1 })
            .returning('*');
        const createdEntry2 = await database('messages')
            .insert({ message: message2, palindrome: palindrome2, created_at: created_at2, updated_at: updated_at2 })
            .returning('*');

        const result = await request(app).get(`/messages`);
        expect(result.status).toBe(200);
        const returnValue = JSON.parse(result.text);
        expect(returnValue.length).toBe(2);
        const returnIds = returnValue.map((message: any) => message.id);
        expect(returnIds).toContain(createdEntry1[0].id);
        expect(returnIds).toContain(createdEntry2[0].id);
    });
});
