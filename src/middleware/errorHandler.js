import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  console.error('Error Middleware:', err);

  // Якщо помилка створена через http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';

  // Усі інші помилки — як внутрішні (500)
  res.status(500).json({
    message: isProd ? 'Oops, we had an error, sorry 🤫' : err.message,
  });
};
