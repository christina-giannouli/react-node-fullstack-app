import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
// @ts-ignore
import areasRouter from './src/routes/areas.ts';

const app: Express = express();
const PORT = process.env.APP_PORT ?? 3000;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use('/api/areas', areasRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
