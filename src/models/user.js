// МОДЕЛЬ КОРИСТУВАЧА

import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    // ---- ІМ'Я КОРИСТУВАЧА ----
    username: {
      type: String,
      trim: true,
    },

    // ---- EMAIL (унікальний ідентифікатор) ----
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // ---- ПАРОЛЬ ----
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    // Автоматично додає createdAt та updatedAt
    timestamps: true,
    // Видаляє поле __v (version key)
    versionKey: false,
  },
);

// PRE-HOOK: Встановлення username за замовчуванням

userSchema.pre('save', function (next) {
  // Якщо username не вказано - встановлюємо його рівним email
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

// МЕТОД toJSON: Видалення пароля з відповіді

userSchema.methods.toJSON = function () {
  // Перетворюю Mongoose документ в звичайний об'єкт
  const obj = this.toObject();

  // Видаляю пароль перед відправкою клієнту
  delete obj.password;

  return obj;
};

// Створюю та експортуємо модель
export const User = model('User', userSchema);
