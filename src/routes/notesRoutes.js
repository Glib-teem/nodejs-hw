// МАРШРУТИ ДЛЯ НОТАТОК (ЗАХИЩЕНІ)

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// ЗАХИСТ ВСІХ МАРШРУТІВ

// Всі маршрути вимагають аутентифікації
router.use('/notes', authenticate);

// ---- GET /notes - отримати всі нотатки користувача ----
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// ---- GET /notes/:noteId - отримати одну нотатку ----
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// ---- POST /notes - створити нову нотатку ----
router.post('/notes', celebrate(createNoteSchema), createNote);

// ---- PATCH /notes/:noteId - оновити нотатку ----
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

// ---- DELETE /notes/:noteId - видалити нотатку ----
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

export default router;
