// МАРШРУТИ АУТЕНТИФІКАЦІЇ

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = Router();

// ---- POST /auth/register - Реєстрація ----
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

// ---- POST /auth/login - Логін ----
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

// ---- POST /auth/refresh - Оновлення сесії ----
router.post('/auth/refresh', refreshUserSession);

// ---- POST /auth/logout - Логаут ----
router.post('/auth/logout', logoutUser);

export default router;
