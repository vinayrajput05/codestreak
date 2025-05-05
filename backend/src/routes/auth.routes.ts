import { Router } from 'express';
import { check, login, logout, register } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const authRoutes = Router();

authRoutes.post('/register', register);

authRoutes.post('/login', login);

authRoutes.post('/logout', authMiddleware, logout);

authRoutes.get('/check', authMiddleware, check);

export default authRoutes;
