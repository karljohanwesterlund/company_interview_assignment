import { Router, Request, Response } from 'express';
import { db } from './db';
import { isMessagePalindrome } from './utils/messageUtils';
import { getIdFromRequest, getMessageFromRequestBody } from './utils/expressUtils';
import { MessageDTO } from '@app-types/MessageDTO';

const router = Router();

const getMessageFromDatabase = async (id: number) => {
    const result = await db('messages').select('*').where({ id });
    const messageResponse: MessageDTO = result[0] as MessageDTO;
    return messageResponse;
};

router.get('/messages/:id', async (request: Request, response: Response<MessageDTO>) => {
    const id = getIdFromRequest(request);

    const messageDTO: MessageDTO = await getMessageFromDatabase(id);
    if (!messageDTO) {
        const error = new Error(`Message with id ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }

    response.json(messageDTO);
});

router.post('/messages', async (request: Request, response: Response<MessageDTO>) => {
    const message = getMessageFromRequestBody(request);
    const palindrome = isMessagePalindrome(message);

    const result = await db('messages').insert({ message, palindrome }).returning('*');
    const messageDTO: MessageDTO = result[0] as MessageDTO;
    response.json(messageDTO);
});

export default router;
