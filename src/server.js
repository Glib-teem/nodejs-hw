import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http'; // Логування
import { errors } from 'celebrate'; // Обробник помилок валідації
import cookieParser from 'cookie-parser'; // Обробка cookies (для аутентифікації)

// 1. ЗАВАНТАЖЕННЯ ЗМІННИХ СЕРЕДОВИЩА
dotenv.config();

// Конфігурація середовища та константи
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
// Використовуємо PORT з HEAD, але дозволяємо 04-auth його перезаписати в .env
const PORT = process.env.PORT || 3000;
const prodMessage = 'Oops, we had an error, sorry 🤫';

// Імпорти
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Додано з 04-auth

const app = express();

// ====== MIDDLEWARE ======

// 1. CORS - запити з інших доменів (Розширена конфігурація з 04-auth для cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*', // URL фронтенду
    credentials: true, // КРИТИЧНО для cookies!
  }),
);

// 2. JSON Parser - обробка JSON у body запиту
app.use(express.json());

// 3. Cookie Parser - обробка cookies (з 04-auth)
app.use(cookieParser());

// 4. Pino Logger - логує всі HTTP-запити (З HEAD)
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

// Аутентифікація (НЕ захищені маршрути) - З 04-auth
app.use(authRoutes);

// Нотатки (ЗАХИЩЕНІ маршрути - потрібен authenticate)
app.use('/notes', notesRoutes); // Використовуємо префікс

// ====== ОБРОБКА ПОМИЛОК ======

// Middleware для обробки 404 (маршрут не знайдено)
app.use(notFoundHandler);

// Middleware для обробки помилок валідації від celebrate
app.use(errors());

// Middleware для обробки помилок 500
app.use(errorHandler);

// Фінальний обробник помилок (З HEAD, виправлений)
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

// Підключення до MongoDB перед запуском сервера
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
