import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = Router();

// GET /notes - отримати всі нотатки
router.get('/notes', getAllNotes);

// GET /notes/:noteId - отримати одну нотатку
router.get('/notes/:noteId', getNoteById);

// POST /notes - створити нову нотатку
router.post('/notes', createNote);

// PATCH /notes/:noteId - оновити нотатку
router.patch('/notes/:noteId', updateNote);

// DELETE /notes/:noteId - видалити нотатку
router.delete('/notes/:noteId', deleteNote);

export default router;
