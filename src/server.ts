import express from 'express';
import routes from './routes.js';

const app = express();
app.use(express.json());
app.use('/', routes);

app.use((request, _response, next) => {
    console.log(`${request.method} ${request.url}`);
    next();
});

app.use((_request, response) => {
    response.status(404).json({ error: 'Not found' });
});

app.use((error: unknown, _request: express.Request, response: express.Response) => {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
});

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
