import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// CONFIG DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { NODE_ENV, PORT } = process.env;

// CONFIG EXPRESS
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ROUTES
app.get('/', (req, res) => {
  res.send('Hello World');
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

// EXPORT APP
export default app;
