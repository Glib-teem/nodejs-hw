import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentsController.js';

const router = Router();

// GET /students - отримати всіх студентів
router.get('/students', getAllStudents);

// GET /students/:studentId - отримати одного студента
router.get('/students/:studentId', getStudentById);

// POST /students - створити нового студента
router.post('/students', createStudent);

// PATCH /students/:studentId - оновити студента
router.patch('/students/:studentId', updateStudent);

// DELETE /students/:studentId - видалити студента
router.delete('/students/:studentId', deleteStudent);

export default router;
