// MIDDLEWARE ДЛЯ ЗАВАНТАЖЕННЯ ФАЙЛІВ

import multer from 'multer';
import createHttpError from 'http-errors';

// ---- НАЛАШТУВАННЯ MULTER ----
export const upload = multer({
  // Зберігаємо файли в пам'яті (Buffer)
  storage: multer.memoryStorage(),

  // Обмеження розміру файлу
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB максимум
  },

  // Фільтр типів файлів
  fileFilter: (req, file, cb) => {
    // Перевіряємо чи файл є зображенням
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(createHttpError(400, 'Only images allowed'));
    }
    // Приймаємо файл
    cb(null, true);
  },
});
