import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http'; // Припускаю, що ви використовуєте pino-http для логування

// 1. ЗАВАНТАЖЕННЯ ЗМІННИХ СЕРЕДОВИЩА
// Викликаємо dotenv.config() лише один раз
dotenv.config();

// Конфігурація середовища та константи
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
// Припускаємо, що prodMessage використовується для безпечного повідомлення
const prodMessage = 'Oops, we had an error, sorry 🤫';

// Імпорти
import { connectMongoDB } from './db/connectMongoDB.js';
// import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
// *Слід додати інші маршрути (authRoutes, userRoutes) після злиття гілок*

const app = express();

// ====== MIDDLEWARE ======

// 1. CORS - запити з інших доменів
app.use(cors());

// 2. JSON Parser - обробка JSON у body запиту
app.use(express.json());

// 3. Pino Logger - логує всі HTTP-запити
// Використовуємо pino-http замість кастомного logger, щоб уникнути дублювання
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

// 4. Додаткове логування (Якщо ви вирішили його залишити)
// app.use(logger);

// ====== МАРШРУТИ ======

// Підключаю маршрути (слід додати authRoutes та userRoutes після злиття)
app.use('/notes', notesRoutes); // Рекомендується додавати префікс до маршрутів

// ====== ОБРОБКА ПОМИЛОК ======

// Middleware для обробки 404 (маршрут не знайдено)
app.use(notFoundHandler);

// Middleware для обробки помилок 500
app.use(errorHandler);

// Виправлений фінальний обробник помилок (потрібен лише один!)
// *Цей блок повинен бути останнім, інакше він може перехопити помилки,
// які мали бути оброблені іншими middleware.*
app.use((err, req, res, _next) => {
  if (isProd) {
    // Production: загальне повідомлення без деталей
    console.error('Error occurred:', err.message);
    res.status(500).json({
      message: prodMessage,
    });
  } else {
    // Development: повні деталі для дебагу
    console.error('Error details:', err);
    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
});

// ====== БД ТА ЗАПУСК СЕРВЕРА ======

// Підключаюся до MongoDB перед запуском сервера
// Використовуємо `await` для очікування підключення
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
