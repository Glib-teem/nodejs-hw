import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  console.error('Error Middleware:', err);

  const isProd = process.env.NODE_ENV === 'production';

  // Обробка HTTP-помилок (створених через http-errors)
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message:
        isProd && err.status === 500
          ? 'Oops, we had an error, sorry 🤫'
          : err.message || err.name,
    });
  }

  // Усі інші помилки
  res.status(500).json({
    message: isProd ? 'Oops, we had an error, sorry 🤫' : err.message,
  });
};
