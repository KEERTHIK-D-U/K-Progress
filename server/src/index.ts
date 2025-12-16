import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import { startScheduler } from './scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('AI Todo Tracker API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
