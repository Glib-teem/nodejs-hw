// СХЕМИ ВАЛІДАЦІЇ ДЛЯ АУТЕНТИФІКАЦІЇ

import { Joi, Segments } from 'celebrate';

// ---- РЕЄСТРАЦІЯ ----
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.base': 'Email must be a string',
    }),

    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required',
      'string.base': 'Password must be a string',
    }),
  }),
};

// ---- ЛОГІН ----
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.base': 'Email must be a string',
    }),

    password: Joi.string().required().messages({
      'any.required': 'Password is required',
      'string.base': 'Password must be a string',
    }),
  }),
};

// ---- ЗАПИТ НА СКИДАННЯ ПАРОЛЮ ----
export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.base': 'Email must be a string',
    }),
  }),
};

// ---- СКИДАННЯ ПАРОЛЮ ----
export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Token is required',
      'string.base': 'Token must be a string',
    }),

    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least {#limit} characters',
      'any.required': 'Password is required',
      'string.base': 'Password must be a string',
    }),
  }),
};
