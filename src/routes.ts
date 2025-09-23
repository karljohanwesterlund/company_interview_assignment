import { Router, Request, Response } from 'express';
import { getMessageFromDatabase, insertMessageToDatabase } from './database';
import { getIdFromRequest, getMessageFromRequestBody } from './utils/expressUtils';
import { MessageDTO } from '@app-types/MessageDTO';

const router = Router();

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
    const messageDTO: MessageDTO = await insertMessageToDatabase(message);
    response.json(messageDTO);
});

export default router;
