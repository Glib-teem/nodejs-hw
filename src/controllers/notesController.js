// КОНТРОЛЕРИ ДЛЯ НОТАТОК (З ПРИВАТНИМ ДОСТУПОМ)

import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// GET /notes - Отримати всі нотатки ПОТОЧНОГО користувача
export const getAllNotes = async (req, res) => {
  // Отримую параметри з query
  const { page = 1, perPage = 10, tag, search } = req.query;

  // Обчислюю скільки записів пропустити
  const skip = (page - 1) * perPage;

  // ---- Фільтрую тільки нотатки поточного користувача ----
  const notesQuery = Note.find({ userId: req.user._id });

  // Фільтр за тегом
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  // Текстовий пошук
  if (search) {
    notesQuery.where({ $text: { $search: search } });
  }

  // Два запити паралельно
  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments({ userId: req.user._id }), // Рахуємо тільки свої
    notesQuery.skip(skip).limit(perPage).sort({ createdAt: -1 }),
  ]);

  // Обчислюю загальну кількість сторінок
  const totalPages = Math.ceil(totalNotes / perPage);

  // Відправляю відповідь
  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

// GET /notes/:noteId - Отримати одну нотатку
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  // ---- Шукаємо нотатку тільки серед своїч ----
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    // Нотатка не знайдена або не належить користувачу
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// POST /notes - Створити нову нотатку
export const createNote = async (req, res) => {
  // ---- Автоматично додаю userId ----
  const note = await Note.create({
    ...req.body,
    userId: req.user._id, // Прив'язуємо до поточного користувача
  });

  res.status(201).json(note);
};

// PATCH /notes/:noteId - Оновити нотатку
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  // ---- Оновлюю тільки свою нотатку ----
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id, // Перевіряю власника
    },
    req.body,
    {
      new: true, // Повертаю оновлений документ
    },
  );

  if (!note) {
    // Нотатка не знайдена або не належить користувачу
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// DELETE /notes/:noteId - Видалити нотатку
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  // ---- Видаляю тільки СВОЮ нотатку ----
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id, // Перевіряю власника
  });

  if (!note) {
    // Нотатка не знайдена або не належить користувачу
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
