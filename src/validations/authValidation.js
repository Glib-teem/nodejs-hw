// СХЕМИ ВАЛІДАЦІЇ ДЛЯ АУТЕНТИФІКАЦІЇ

import { Joi, Segments } from 'celebrate';

// РЕЄСТРАЦІЯ КОРИСТУВАЧА
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    // Email - обов'язкове поле
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.base': 'Email must be a string',
    }),

    // Password - мінімум 8 символів, обов'язкове
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required',
      'string.base': 'Password must be a string',
    }),
  }),
};

// ЛОГІН КОРИСТУВАЧА
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    // Email - обов'язкове поле
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.base': 'Email must be a string',
    }),

    // Password - обов'язкове поле
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
      'string.base': 'Password must be a string',
    }),
  }),
};
