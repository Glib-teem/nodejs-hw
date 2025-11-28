// КОНТРОЛЕРИ КОРИСТУВАЧА

import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// ОНОВЛЕННЯ АВАТАРА КОРИСТУВАЧА

export const updateUserAvatar = async (req, res, next) => {
  try {
    // ---- Перевірка наявності файлу ----
    if (!req.file) {
      return next(createHttpError(400, 'No file'));
    }

    // ---- Завантаження файлу в Cloudinary ----
    const result = await saveFileToCloudinary(req.file.buffer);

    // ---- Оновлення аватара в БД ----
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true },
    );

    // ---- Відповідь ----
    res.status(200).json({
      url: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};
