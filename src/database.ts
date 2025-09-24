import knex, { Knex } from 'knex';
import config from '../knexfile';
import * as dotenv from 'dotenv';
import { MessageDTO } from '@app-types/MessageDTO';
import { isMessagePalindrome } from './utils/messageUtils';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
export const database: Knex = knex((config as any)[env]);

process.on('SIGINT', async () => {
    await database.destroy();
    process.exit(0);
});

export const getMessageFromDatabase = async (id: number) => {
    const result = await database('messages').select('*').where({ id });
    const messageDTO: MessageDTO = result[0] as MessageDTO;
    return messageDTO;
};

export const insertMessageToDatabase = async (message: string) => {
    const palindrome = isMessagePalindrome(message);
    const result = await database('messages').insert({ message, palindrome }).returning('*');
    const messageDTO: MessageDTO = result[0] as MessageDTO;
    return messageDTO;
};

export const updateMessageInDatabase = async (id: number, message: string) => {
    const palindrome = isMessagePalindrome(message);
    const result = await database('messages')
        .update({ message, palindrome, updated_at: new Date().getTime() })
        .where({ id })
        .returning('*');
    const messageDTO: MessageDTO = result[0] as MessageDTO;
    return messageDTO;
};
