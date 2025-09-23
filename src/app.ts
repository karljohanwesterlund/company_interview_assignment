import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';

const app = express();
app.use(express.json());
app.use('/', routes);

app.use((request: Request, _response: Response, next: NextFunction) => {
    console.log(`${request.method} ${request.url}`);
    next();
});

app.use((_request: Request, response: Response) => {
    response.status(404).json({ error: 'Not found' });
});

app.use((error: any, _request: Request, response: Response, _next: NextFunction) => {
    console.error(error);
    response.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
});

export default app;
