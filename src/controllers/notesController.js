import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// GET /notes - Отримати всі нотатки з пагінацією, фільтрацією та пошуком
export const getAllNotes = async (req, res) => {
  // Отримую параметри з query
  const { page = 1, perPage = 10, tag, search } = req.query;

  // Обчислюю скільки записів пропустити
  const skip = (page - 1) * perPage;

  // Створюю базовий запит
  const notesQuery = Note.find();

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
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage).sort({ createdAt: -1 }),
  ]);

  // Обчисляю загальну кількість сторінок
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

// GET /notes/:noteId - Отримати одну нотатку за ID
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// POST /notes - Створити нову нотатку
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// PATCH /notes/:noteId - Оновити нотатку
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// DELETE /notes/:noteId - Видалити нотатку
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
