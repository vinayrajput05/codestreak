import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { executeCode } from '../controllers/executeCode.controller';

const executionRoute = Router();

executionRoute.post('/', authMiddleware, executeCode);

export default executionRoute;
