import { Router } from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.patch(
  '/users/me/avatar',
  authenticate,
  // Додаємо після авторизації, але до контролера
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;
