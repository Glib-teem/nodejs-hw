import nodemailer from 'nodemailer';

// ---- СТВОРЕННЯ TRANSPORTER ДЛЯ SMTP ----

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP-сервер Brevo
  port: process.env.SMTP_PORT, // Порт (587 для TLS)
  auth: {
    user: process.env.SMTP_USER, // SMTP логін
    pass: process.env.SMTP_PASSWORD, // SMTP пароль
  },
});

// ФУНКЦІЯ НАДСИЛАННЯ EMAIL

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
