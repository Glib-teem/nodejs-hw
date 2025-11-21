import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; //
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Завантажую змінні з .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// ====== MIDDLEWARE ======

// 1. Logger - логування HTTP-запитів
app.use(logger);

// 2. JSON Parser - обробка JSON у body запиту
app.use(express.json());

// 3. CORS - запити з інших доменів
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*', // URL фронтенду
    credentials: true, // КРИТИЧНО для cookies!
  }),
);

// 4. Cookie Parser - обробка cookies
app.use(cookieParser());

// ====== МАРШРУТИ ======

// Аутентифікація (НЕ захищені маршрути)
app.use(authRoutes);

// Нотатки (ЗАХИЩЕНІ маршрути - потрібен authenticate)
app.use(notesRoutes);

// ====== ОБРОБКА ПОМИЛОК ======

// Middleware для обробки 404 (маршрут не знайдено)
app.use(notFoundHandler);

// Middleware для обробки помилок валідації від celebrate
app.use(errors());

// Middleware для обробки помилок 500
app.use(errorHandler);

// ====== БД ТА ЗАПУСК СЕРВЕРА ======

// Підключення до MongoDB перед запуском сервера
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
