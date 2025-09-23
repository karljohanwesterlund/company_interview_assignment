import { Router, Request, Response } from 'express';
import { db } from './db';
import { isMessagePalindrome } from './messageUtils';

const router = Router();

type MessageResponse = {
    message: string;
    id: number;
    palindrome: boolean;
    created_at: Date;
    updated_at: Date;
};

const getMessageFromRequestBody = (request: Request): string => {
    const message = request.body.message;
    if (!message) {
        const error = new Error("'message' must exist.");
        (error as any).status = 404;
        throw error;
    }
    return message;
};

const getIdFromRequest = (request: Request): number => {
    const id: number = Number.parseInt(request.params.id, 10);
    if (Number.isNaN(id)) {
        const error = new Error("'id' must be a number.");
        (error as any).status = 400;
        throw error;
    }
    return id;
};

const getMessageFromDatabase = async (id: number) => {
    const result = await db('messages').select('*').where({ id });
    const messageResponse: MessageResponse = result[0] as MessageResponse;
    return messageResponse;
};

router.get('/messages/:id', async (request, response) => {
    const id = getIdFromRequest(request);

    const messageResponse: MessageResponse = await getMessageFromDatabase(id);
    if (!messageResponse) {
        const error = new Error(`Message with id ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }

    response.json(messageResponse);
});

router.post('/messages', async (request, response: Response<MessageResponse>) => {
    const message = getMessageFromRequestBody(request);
    const palindrome = isMessagePalindrome(message);

    const result = await db('messages').insert({ message, palindrome }).returning('*');
    const messageResponse: MessageResponse = result[0] as MessageResponse;
    response.json(messageResponse);
});

export default router;
