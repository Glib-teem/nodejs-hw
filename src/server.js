import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Завантажую змінні з .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====== MIDDLEWARE ======

// логування HTTP-запитів
app.use(logger);

// JSON Parser - обробка JSON у body запиту
app.use(express.json());

// CORS - запити з інших доменів
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  }),
);

// Cookie Parser - обробка cookies
app.use(cookieParser());

// ====== МАРШРУТИ ======

// Аутентифікація (НЕ захищені)
app.use(authRoutes);

// Користувачі (ЗАХИЩЕНІ)
app.use(userRoutes);

// Нотатки (ЗАХИЩЕНІ)
app.use(notesRoutes);

// ====== ОБРОБКА ПОМИЛОК ======

// 404 - маршрут не знайдено
app.use(notFoundHandler);

// Помилки валідації celebrate
app.use(errors());

// 500 - серверна помилка
app.use(errorHandler);

// ====== БД ТА ЗАПУСК СЕРВЕРА ======

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
