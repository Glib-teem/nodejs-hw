// MIDDLEWARE АУТЕНТИФІКАЦІЇ

import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    // ---- Перевіряю наявності accessToken ----
    const { accessToken } = req.cookies;

    if (!accessToken) {
      // Токен відсутній - користувач не залогінений
      return next(createHttpError(401, 'Missing access token'));
    }

    // ---- Пошук сесії за токеном ----
    const session = await Session.findOne({ accessToken });

    if (!session) {
      // Сесія не знайдена - токен невалідний
      return next(createHttpError(401, 'Session not found'));
    }

    // ---- Перевіряю терміну дії токена ----
    const isTokenExpired = new Date() > new Date(session.accessTokenValidUntil);

    if (isTokenExpired) {
      // Access token прострочений
      return next(createHttpError(401, 'Access token expired'));
    }

    // ---- Пошук користувача ----
    const user = await User.findById(session.userId);

    if (!user) {
      // Користувач не знайдений (можливо видалений)
      return next(createHttpError(401));
    }

    // ---- Додаю користувача до req ----
    req.user = user;
    // Тепер req.user доступний у всіх наступних контролерах

    next();
  } catch (error) {
    next(error);
  }
};
