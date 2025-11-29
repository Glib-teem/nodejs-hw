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

const router = Router();

// GET /notes - отримати всі нотатки з валідацією query параметрів
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// GET /notes/:noteId - отримати одну нотатку з валідацією noteId
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// POST /notes - створити нову нотатку з валідацією body
router.post('/notes', celebrate(createNoteSchema), createNote);

// PATCH /notes/:noteId - оновити нотатку з валідацією noteId та body
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

// DELETE /notes/:noteId - видалити нотатку з валідацією noteId
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

export default router;
