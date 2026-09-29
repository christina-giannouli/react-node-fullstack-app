import dotenv from 'dotenv';
import app from './app.ts';

dotenv.config({ path: ['.env.local', '.env'] });

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
