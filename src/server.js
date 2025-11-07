import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import studentsRoutes from './routes/studentsRoutes.js';

// Завантажую змінні з .env файлу
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====== MIDDLEWARE ======
// 1. Logger - логування HTTP-запитів
app.use(logger);

// 2. JSON Parser - обробка JSON у body запиту
app.use(express.json());

// 3. CORS - запити з інших доменів
app.use(cors());

// ====== МАРШРУТИ ======
// Підключаю маршрути для роботи зі студентами
app.use(studentsRoutes);

// ====== ОБРОБКА ПОМИЛОК ======
// Middleware для обробки 404 (маршрут не знайдено)
app.use(notFoundHandler);

// Middleware для обробки помилок 500
app.use(errorHandler);

// ====== БД ТА ЗАПУСК СЕРВЕРА ======
// Підключення до MongoDB перед запуском сервера
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
