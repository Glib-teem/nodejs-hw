import createHttpError from 'http-errors';
import { Student } from '../models/student.js';

// GET /students - Отримати всіх студентів
export const getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
};

// GET /students/:studentId - Отримати одного студента за ID
export const getStudentById = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};

// POST /students - Створити нового студента
export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

// PATCH /students/:studentId - Оновити студента
export const updateStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate({ _id: studentId }, req.body, {
    new: true,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};

// DELETE /students/:studentId - Видалити студента
export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndDelete({
    _id: studentId,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};
