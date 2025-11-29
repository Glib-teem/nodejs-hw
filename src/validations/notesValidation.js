import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомний валідатор для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Invalid note ID format')
    : value;
};

// GET /notes - валідація query параметрів (пагінація, фільтрація, пошук)
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least {#limit}',
    }),
    perPage: Joi.number().integer().min(5).max(20).default(10).messages({
      'number.base': 'PerPage must be a number',
      'number.min': 'PerPage must be at least {#limit}',
      'number.max': 'PerPage must be at most {#limit}',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
    search: Joi.string().trim().allow('').messages({
      'string.base': 'Search must be a string',
    }),
  }),
};

// GET /notes/:noteId та DELETE /notes/:noteId - валідація параметра noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.required': 'Note ID is required',
      'string.base': 'Note ID must be a string',
    }),
  }),
};

// POST /notes - валідація тіла запиту для створення нотатки
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must have at least {#limit} character',
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
  }),
};

// PATCH /notes/:noteId - валідація параметра noteId та тіла запиту
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.required': 'Note ID is required',
      'string.base': 'Note ID must be a string',
    }),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must have at least {#limit} character',
      'string.empty': 'Title cannot be empty',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
  })
    .min(1)
    .messages({
      'object.min':
        'At least one field (title, content, or tag) must be provided',
    }),
};
