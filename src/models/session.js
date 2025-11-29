// МОДЕЛЬ СЕСІЇ

import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    // ---- ID КОРИСТУВАЧА (власник сесії) ----
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ---- ACCESS TOKEN (короткоживучий токен) ----
    accessToken: {
      type: String,
      required: true,
    },

    // ---- REFRESH TOKEN (довгоживучий токен) ----
    refreshToken: {
      type: String,
      required: true,
    },

    // ---- ТЕРМІН ДІЇ ACCESS TOKEN ----
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },

    // ---- ТЕРМІН ДІЇ REFRESH TOKEN ----
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    // Автоматично додає createdAt та updatedAt
    timestamps: true,
    // Видаляє поле __v
    versionKey: false,
  },
);

// Створюю та експортуємо модель
export const Session = model('Session', sessionSchema);
