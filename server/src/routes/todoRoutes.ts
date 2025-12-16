
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { generatePlan } from '../controllers/aiController';
import { createTodo, getTodos, updateProgress, deleteTodo, exportTodos, getTodoStats, archiveTodo } from '../controllers/todoController';

const router = express.Router();

// Middleware to protect routes
const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

router.route('/')
    .post(protect, createTodo)
    .get(protect, getTodos);

router.post('/plan', protect, generatePlan);
router.post('/:id/archive', protect, archiveTodo); // Added archive route
router.get('/export', protect, exportTodos);
router.get('/stats', protect, getTodoStats);

router.put('/:id/progress', protect, updateProgress);
router.delete('/:id', protect, deleteTodo);

export default router;
