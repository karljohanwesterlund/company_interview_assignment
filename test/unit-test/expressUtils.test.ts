import { getMessageFromRequestBody, getIdFromRequest } from '../../src/utils/expressUtils';

describe('getMessageFromRequestBody', () => {
    it('should return message from request body', () => {
        const req = { body: { message: 'hello' } } as any;
        expect(getMessageFromRequestBody(req)).toBe('hello');
    });

    it('should throw error if message is missing', () => {
        const req = { body: {} } as any;
        expect(() => getMessageFromRequestBody(req)).toThrow("'message' must exist.");
    });
});

describe('getIdFromRequest', () => {
    it('should return id as number from request params', () => {
        const req = { params: { id: '0' } } as any;
        expect(getIdFromRequest(req)).toBe(0);
    });

    it('should throw error if id is not a number', () => {
        const req = { params: { id: 'abc' } } as any;
        expect(() => getIdFromRequest(req)).toThrow("'id' must exist or be a number.");
    });

    it('should throw error if id is missing', () => {
        const req = { params: {} } as any;
        expect(() => getIdFromRequest(req)).toThrow("'id' must exist or be a number.");
    });
});
