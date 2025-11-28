// КОНТРОЛЕРИ АУТЕНТИФІКАЦІЇ

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { sendEmail } from '../utils/sendMail.js';

// РЕЄСТРАЦІЯ КОРИСТУВАЧА

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const session = await createSession(newUser._id);

    setSessionCookies(res, session);

    // Явно викликаємо toJSON()
    res.status(201).json(newUser.toJSON());
  } catch (error) {
    next(error);
  }
};

// ЛОГІН КОРИСТУВАЧА

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    // Видаляємо всі сесії (deleteMany замість deleteOne)
    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);

    setSessionCookies(res, session);

    // Явно викликаю toJSON()
    res.status(200).json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

// ОНОВЛЕННЯ СЕСІЇ

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    const session = await Session.findOne({
      _id: sessionId,
      refreshToken,
    });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    const isTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isTokenExpired) {
      return next(createHttpError(401, 'Session token expired'));
    }

    await Session.deleteOne({ _id: sessionId });

    const newSession = await createSession(session.userId);

    setSessionCookies(res, newSession);

    res.status(200).json({
      message: 'Session refreshed',
    });
  } catch (error) {
    next(error);
  }
};

// ЛОГАУТ КОРИСТУВАЧА

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.clearCookie('sessionId', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  res.status(204).send();
};

// ЗАПИТ НА СКИДАННЯ ПАРОЛЮ

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // ---- Пошук користувача ----
    const user = await User.findOne({ email });

    // (Anti User Enumeration)
    if (!user) {
      return res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    }

    // ---- Генерація JWT токена ----
    const resetToken = jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );

    // ---- Читання HTML шаблону ----
    const templatePath = path.resolve(
      'src/templates/reset-password-email.html',
    );
    const templateSource = await fs.readFile(templatePath, 'utf-8');

    // ---- Компіляція шаблону Handlebars ----
    const template = handlebars.compile(templateSource);

    // ---- Підстановка даних у шаблон ----
    const html = template({
      // fallback для username
      name: user.username || user.email,
      link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
    });

    // ---- Надсилання email ----
    try {
      await sendEmail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset your password',
        html,
      });
    } catch (_error) {
      // підкреслення для unused змінної
      // Логування помилки для діагностики
      console.error('Failed to send reset email:', _error);

      return next(
        createHttpError(
          500,
          'Failed to send the email, please try again later.',
        ),
      );
    }

    // ---- Успішна відповідь ----
    res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// СКИДАННЯ ПАРОЛЮ

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // ---- Верифікація JWT токена ----
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_error) {
      // підкреслення для unused змінної
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    // ---- Пошук користувача ----
    const user = await User.findOne({
      _id: payload.sub,
      email: payload.email,
    });

    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    // ---- Хешування нового паролю ----
    const hashedPassword = await bcrypt.hash(password, 10);

    // Використовуємо .save() замість .updateOne() - активує mongoose hooks та middleware
    user.password = hashedPassword;
    await user.save();

    // ---- Видалення всіх сесій користувача ----
    // logout з усіх пристроїв
    await Session.deleteMany({ userId: user._id });

    // ---- Успішна відповідь ----
    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
