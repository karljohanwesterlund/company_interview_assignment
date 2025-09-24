import { Request } from 'express';

export const getMessageFromRequestBody = (request: Request): string => {
    const message = request.body.message;
    if (!message) {
        const error = new Error("'message' must exist.");
        (error as any).status = 400;
        throw error;
    }
    return message;
};

export const getIdFromRequest = (request: Request): number => {
    const id: number = Number.parseInt(request.params.id, 10);
    if (Number.isNaN(id)) {
        const error = new Error("'id' must exist or be a number.");
        (error as any).status = 400;
        throw error;
    }
    return id;
};
