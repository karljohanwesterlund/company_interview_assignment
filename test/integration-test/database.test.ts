import type { Knex } from 'knex';
import { database } from '../../src/database';
import { insertMessageToDatabase, getMessageFromDatabase } from '../../src/database';

describe('database', () => {
    let knex: Knex = database;
    beforeAll(async () => {
        if (knex.client.config.client !== 'sqlite3') {
            // Ensure we run tests against the sqlite test db
            process.exit(1);
        }
        await knex.migrate.latest();
    });

    afterAll(async () => {
        await knex('messages').truncate();
        await knex.destroy();
    });

    describe('insertMessageToDatabase', () => {
        it('should insert message and returns the value - the same as the one in the DB', async () => {
            const messageToInsert = 'test';
            const result = await insertMessageToDatabase(messageToInsert);

            expect(result.id).toBeDefined();
            expect(result.message).toBe(messageToInsert);
            expect(result.palindrome).toBeFalsy();
            expect(result.created_at).toBeDefined();
            expect(result.updated_at).toBeDefined();

            const databaseValueSelect: any = await knex('messages').select('*').where({ id: result.id });
            const databaseValue = databaseValueSelect[0];
            expect(databaseValue.id).toBe(result.id);
            expect(databaseValue.message).toBe(messageToInsert);
            expect(databaseValue.palindrome).toBe(result.palindrome);
            expect(databaseValue.created_at).toBe(result.created_at);
            expect(databaseValue.updated_at).toBe(result.updated_at);
        });
    });
    describe('getMessageFromDatabase', () => {
        it('should get the existing DB entry from an ID', async () => {
            const [message, palindrome, created_at, updated_at] = ['abc', true, new Date().getTime(), new Date().getTime()];
            const createdEntry = await knex('messages').insert({ message, palindrome, created_at, updated_at }).returning('*');
            const result = await getMessageFromDatabase(createdEntry[0].id);

            expect(result.id).toBe(createdEntry[0].id);
            expect(result.message).toBe(message);
            expect(result.palindrome).toBeTruthy();
            expect(result.created_at).toBe(created_at);
            expect(result.updated_at).toBe(updated_at);
        });
    });
});
