import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import areasRouter from './src/routes/areas.ts';

const app: Express = express();

// Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use('/api/areas', areasRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
