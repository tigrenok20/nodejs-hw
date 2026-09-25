import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// // Логування часу
// app.use((req, res, next) => {
//   console.log(`Time: ${new Date().toLocaleString()}`);
//   next();
// });

// Список усіх нотатків
app.get('/notes', (req, res) => {
  res.status(200).json([{ message: 'Retrieved all notes' }]);
});

// Конкретна нотатка за id
app.get('/notes/:noteId', (req, res) => {
  const { id_param } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${id_param}` });
});

//Tестовий маршрут для імітації виникнення помилки:
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для обробки помилок (останнє)
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

const PORT = process.env.PORT ?? 3000;
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
