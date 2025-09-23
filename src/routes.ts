import { Router } from 'express';

const router = Router();

router.get('/', (_request, response) => {
    response.json({ message: 'Hello world!' });
});

export default router;
