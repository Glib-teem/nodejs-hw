// ЗАВАНТАЖЕННЯ ФАЙЛІВ В CLOUDINARY

import 'dotenv/config';

import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

// ---- КОНФІГУРАЦІЯ CLOUDINARY ----

cloudinary.config({
  secure: true, // Використовувати HTTPS
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ФУНКЦІЯ ЗАВАНТАЖЕННЯ ФАЙЛУ

export async function saveFileToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    // ---- СТВОРЕННЯ UPLOAD STREAM ----
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'students-app/avatars', // Папка в Cloudinary
        resource_type: 'image',
        overwrite: true,
        unique_filename: true,
        use_filename: false,
      },
      (err, result) => {
        // Callback викликається Cloudinary після завантаження
        if (err) {
          reject(err); // Помилка - Promise rejected
        } else {
          resolve(result); // Успіх - Promise resolved
        }
      },
    ); // ---- ПЕРЕДАЧА ДАНИХ ----
    // Перетворюємо Buffer в Readable потік і передаємо в Cloudinary

    Readable.from(buffer).pipe(uploadStream);
  });
}
