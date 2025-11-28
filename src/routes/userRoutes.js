// МАРШРУТИ КОРИСТУВАЧА

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { updateUserAvatar } from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';

const router = Router();

// PATCH /users/me/avatar - Оновлення аватара
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  // Middleware для обробки помилок Multer
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
    next();
  },
  updateUserAvatar,
);

export default router;
