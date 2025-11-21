// МОДЕЛЬ НОТАТКИ (З ВЛАСНИКОМ)

import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    // ---- ЗАГОЛОВОК ----
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ---- ВМІСТ ----
    content: {
      type: String,
      default: '',
      trim: true,
    },

    // ---- ТЕГ ----
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },

    // ---- ВЛАСНИК НОТАТКИ
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Текстовий індекс для пошуку
noteSchema.index(
  { title: 'text', content: 'text' },
  {
    name: 'NoteTextIndex',
    weights: { title: 10, content: 5 },
    default_language: 'english',
  },
);

export const Note = model('Note', noteSchema);
