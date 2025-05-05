import 'dotenv/config';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.middleware';
import authRoutes from './routes/auth.routes';

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, (err) => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
