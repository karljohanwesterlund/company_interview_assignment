import { Router, Request, Response } from 'express';
import {
    deleteMessageFromDatabase,
    getMessageFromDatabase,
    getMessagesFromDatabase,
    insertMessageToDatabase,
    updateMessageInDatabase,
} from './database';
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
    response.status(201).json(messageDTO);
});

router.patch('/messages/:id', async (request, response: Response<MessageDTO>) => {
    const id = getIdFromRequest(request);
    const message = getMessageFromRequestBody(request);
    const existingMessage = await getMessageFromDatabase(id);
    if (!existingMessage) {
        const error = new Error(`Message with id ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }

    const messageDTO: MessageDTO = await updateMessageInDatabase(id, message);
    response.json(messageDTO);
});

router.delete('/messages/:id', async (request, response: Response<MessageDTO>) => {
    const id = getIdFromRequest(request);
    const existingMessage = await getMessageFromDatabase(id);
    if (!existingMessage) {
        const error = new Error(`Message with id ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }

    const messageDTO: MessageDTO = await deleteMessageFromDatabase(id);
    response.json(messageDTO);
});

router.get('/messages', async (_request: Request, response: Response<MessageDTO[]>) => {
    const messageDTOs: MessageDTO[] = await getMessagesFromDatabase();
    response.json(messageDTOs);
});

export default router;
