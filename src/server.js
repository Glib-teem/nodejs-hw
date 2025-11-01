import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino-http';
import dotenv from 'dotenv';

// Завантажуємо змінні з .env файлу
dotenv.config();

// Створюємо Express додаток
const app = express();

// Отримуємо порт та середовище із змінних оточення
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ====== MIDDLEWARE ======

// 1. Helmet - захист через HTTP заголовки
app.use(helmet());

// 2. CORS - дозволяє запити з інших доменів
app.use(cors());

// 3. JSON Parser - дозволяє обробляти JSON у body запиту
app.use(express.json());

// 4. Logger - логує всі HTTP-запити
// У production логи простіші, у development - з кольорами
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
  })
);

// ====== МАРШРУТИ ======

// GET /notes - отримати всі нотатки
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// GET /notes/:noteId - отримати нотатку за ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// GET /test-error - тестовий маршрут для помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// ====== ОБРОБКА ПОМИЛОК ======

// Middleware для обробки 404 (маршрут не знайдено)
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// Middleware для обробки помилок 500
// Умовна обробка залежно від середовища
app.use((err, req, res, _next) => {
  // У development показуємо повний stack trace
  if (NODE_ENV === 'development') {
    console.error('Error details:', err);
    res.status(500).json({
      message: err.message,
      stack: err.stack, // Показуємо stack trace тільки в dev
    });
  } else {
    // У production показуємо тільки повідомлення
    console.error('Error:', err.message);
    res.status(500).json({
      message: err.message,
    });
  }
});

// ====== ЗАПУСК СЕРВЕРА ======

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
