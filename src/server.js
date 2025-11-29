import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http';
import { errors } from 'celebrate'; // <--- ВИПРАВЛЕННЯ

// 1. ЗАВАНТАЖЕННЯ ЗМІННИХ СЕРЕДОВИЩА
dotenv.config();

// Конфігурація середовища та константи
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
const prodMessage = 'Oops, we had an error, sorry 🤫';

// Імпорти
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();

// ====== MIDDLEWARE ======

// 1. CORS - запити з інших доменів
app.use(cors());

// 2. JSON Parser - обробка JSON у body запиту
app.use(express.json());

// 3. Pino Logger - логує всі HTTP-запити
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
        : undefined,
  }),
);

// ====== МАРШРУТИ ======

app.use('/notes', notesRoutes);

// ====== ОБРОБКА ПОМИЛОК ======

// Middleware для обробки 404 (маршрут не знайдено)
app.use(notFoundHandler);

// Middleware для обробки помилок валідації від celebrate (тепер errors імпортовано)
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

const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
