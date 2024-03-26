import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import db from '../models';

// CONFIG DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { PORT, DB_NAME } = process.env;

// CONFIG EXPRESS
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ROUTES
app.use('/api/', routes);

// INITIATE SERVER
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// INITIATE DATABASE
const dbCon = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`Database ${DB_NAME} connected successfully`);
  } catch (error) {
    console.log(error);
  }
};

// START SERVER
Promise.all([server, dbCon()]).catch((error) => {
  console.log(`Server error: ${error.message}`);
});

// EXPORT SERVER
export default app;