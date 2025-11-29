// СЕРВІСИ АУТЕНТИФІКАЦІЇ

import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

// ФУНКЦІЯ СТВОРЕННЯ СЕСІЇ
export const createSession = async (userId) => {
  // Генерую унікальні токени
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  // Створюю нову сесію в базі даних
  return await Session.create({
    userId,
    accessToken,
    refreshToken,

    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

// ФУНКЦІЯ ВСТАНОВЛЕННЯ COOKIES
export const setSessionCookies = (res, session) => {
  // Базові налаштування для всіх cookies
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  // ---- COOKIE Access Token ----
  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  // ---- COOKIE Refresh Token ----
  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  // ---- COOKIE Session ID ----
  res.cookie('sessionId', session._id.toString(), {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};
