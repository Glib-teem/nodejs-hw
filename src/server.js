import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http'; // Логування (З HEAD)
import { errors } from 'celebrate'; // Обробник помилок валідації
import cookieParser from 'cookie-parser'; // Обробка cookies (З HEAD)

// 1. ЗАВАНТАЖЕННЯ ЗМІННИХ СЕРЕДОВИЩА
// Викликаємо dotenv.config() лише один раз
dotenv.config();

// Конфігурація середовища та константи
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
// Зберігаємо PORT з HEAD, який визначено коректно на основі .env
const PORT = process.env.PORT || 3000;
const prodMessage = 'Oops, we had an error, sorry :(';

// Імпорти
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
// *Примітка: У 05-mail-and-img був імпортований logger, але ми його ігноруємо,
// оскільки використовуємо pino-http.*
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; // <-- Додано з 05-mail-and-img

const app = express();

// ====== MIDDLEWARE ======

// 1. CORS - запити з інших доменів (Розширена конфігурація для cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*', // URL фронтенду
    credentials: true, // КРИТИЧНО для cookies!
  }),
);

// 2. JSON Parser - обробка JSON у body запиту
app.use(express.json());

// 3. Cookie Parser - обробка cookies
app.use(cookieParser());

// 4. Pino Logger - логує всі HTTP-запити
app.use(
  pino({
    transport:
      NODE_ENV === 'development'
        ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
        : undefined, // В продакшні використовуємо стандартний JSON-формат
  }),
);

// ====== МАРШРУТИ ======

// Аутентифікація (НЕ захищені маршрути)
app.use(authRoutes);

// Користувачі (ЗАХИЩЕНІ маршрути) - Додано з 05-mail-and-img
app.use('/users', userRoutes);

// Нотатки (ЗАХИЩЕНІ маршрути)
app.use('/notes', notesRoutes); // Зберігаємо префікс для порядку

// ====== ОБРОБКА ПОМИЛОК ======

// Middleware для обробки 404 (маршрут не знайдено)
app.use(notFoundHandler);

// Middleware для обробки помилок валідації від celebrate
app.use(errors());

// Middleware для обробки помилок 500
app.use(errorHandler);

// Фінальний обробник помилок
app.use((err, req, res, _next) => {
  if (isProd) {
    console.error('Error occurred:', err.message);
    res.status(500).json({
      message: prodMessage,
    });
  } else {
    console.error('Error details:', err);
    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
});

// ====== БД ТА ЗАПУСК СЕРВЕРА ======

// Підключення до MongoDB перед запуском сервера (Надійна асинхронна функція з HEAD)
const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Вихід з процесу у разі помилки підключення
  }
};

startServer();
