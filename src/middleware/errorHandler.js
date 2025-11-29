// MIDDLEWARE ДЛЯ ОБРОБКИ ПОМИЛОК

export const errorHandler = (error, req, res, _next) => {
  // Обробка помилок Multer
  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 400,
        message: 'File too large. Maximum size is 2MB',
      });
    }
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }

  // Обробка інших помилок
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    status,
    message,
  });
};
