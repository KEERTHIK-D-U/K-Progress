import { Request, Response } from 'express';
import { Todo } from '../models/Todo';
import { LongTermTask } from '../models/LongTermTask';

// Create Todo
export const createTodo = async (req: Request, res: Response) => {
    try {
        const {
            type, title, description, dueDate, priority, category,
            duration, startDate, targetDate, reminderEnabled, motivationalEnabled, contactPreference, milestones
        } = req.body;

        const todo = await Todo.create({
            userId: (req as any).user.id, // Auth middleware adds user
            type,
            title,
            description,
            dueDate,
            priority,
            category,
            duration,
            startDate,
            targetDate,
            reminderEnabled,
            motivationalEnabled,
            contactPreference,
            milestones,
            status: 'pending'
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error });
    }
};

// Get Todos
export const getTodos = async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find({ userId: (req as any).user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
};

// Update Progress & Milestones (For Modern AI Todos)
export const updateProgress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { progress, note, milestones } = req.body;

        const todo = await Todo.findById(id);

        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }

        if (todo.userId.toString() !== (req as any).user.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        if (progress !== undefined) todo.progress = progress;

        // Add log if provided
        if ((req.body as any).logText) {
            if (!todo.logs) todo.logs = [];
            todo.logs.push({
                date: new Date(),
                text: (req.body as any).logText
            });
        }

        // Update Milestones if provided
        if (milestones && Array.isArray(milestones)) {
            // We need to merge existing milestones with new status, strictly preserving _id if possible,
            // or just replacing. For simplicity in this logic, we iterate and match.
            // Since we receive the full array from frontend usually:
            todo.milestones = milestones.map((m: any) => {
                const existing = todo.milestones?.find(em => em.title === m.title); // Matching by title is risky if duplicates, but okay for now
                // Check if just completed
                let completedAt = existing?.completedAt;
                if (m.completed && !existing?.completed) {
                    completedAt = new Date();
                } else if (!m.completed) {
                    completedAt = undefined;
                }
                return {
                    title: m.title,
                    completed: m.completed,
                    completedAt: completedAt || m.completedAt // Trust payload or calculated
                };
            });
        }

        todo.lastUpdated = new Date();
        todo.streak += 1; // Increment streak on interaction

        if (progress === 100) {
            todo.status = 'completed';
            todo.completedAt = new Date();
        } else if (todo.status === 'completed' && progress < 100) {
            todo.status = 'in-progress';
            todo.completedAt = undefined;
        } else {
            todo.status = 'in-progress';
        }

        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress' });
    }
};


// Archive Todo (Complete Long Term Task)
export const archiveTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { learning } = req.body;
        const userId = (req as any).user.id;

        const todo = await Todo.findById(id);

        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }

        if (todo.userId.toString() !== userId) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        // Create LongTermTask
        await LongTermTask.create({
            userId,
            title: todo.title,
            description: todo.description,
            startDate: todo.startDate || todo.createdAt,
            completedAt: new Date(),
            learning: learning || 'Completed'
        });

        // Delete Original Todo
        await todo.deleteOne();

        res.json({ message: 'Goal archived successfully' });
    } catch (error) {
        console.error('Archive error:', error);
        res.status(500).json({ message: 'Error archiving goal' });
    }
};


// Export Todos (CSV)
export const exportTodos = async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find({ userId: (req as any).user.id }).lean();

        if (!todos.length) {
            res.status(404).json({ message: 'No todos to export' });
            return;
        }

        const fields = ['title', 'type', 'status', 'progress', 'createdAt'];
        const csvContent = [
            fields.join(','),
            ...todos.map((t: any) => fields.map(field => JSON.stringify(t[field] || '')).join(','))
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment('todos_export.csv');
        return res.send(csvContent);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting todos' });
    }
};

// Get Todo Stats (Real Analytics)
export const getTodoStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const todos = await Todo.find({ userId });
        const archivedTasks = await LongTermTask.find({ userId });

        const today = new Date();
        const activityMap = new Map<string, number>();

        // Initialize map for last 365 days
        const last365Days = [];
        for (let i = 364; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            activityMap.set(key, 0); // Init with 0
            last365Days.push(key);
        }

        let totalActivities = 0;

        // Process Active Todos
        todos.forEach(todo => {
            // Task Completion
            if (todo.completedAt) {
                const d = todo.completedAt.toISOString().split('T')[0];
                if (activityMap.has(d)) {
                    activityMap.set(d, activityMap.get(d)! + 1);
                    totalActivities++;
                }
            }

            // Milestone Completions
            if (todo.milestones && todo.milestones.length > 0) {
                todo.milestones.forEach(m => {
                    if (m.completed && m.completedAt) {
                        const d = new Date(m.completedAt).toISOString().split('T')[0];
                        if (activityMap.has(d)) {
                            activityMap.set(d, activityMap.get(d)! + 1);
                            totalActivities++;
                        }
                    }
                });
            }
        });

        // Process Archived Tasks (LongTermTask)
        archivedTasks.forEach(task => {
            if (task.completedAt) {
                const d = task.completedAt.toISOString().split('T')[0];
                if (activityMap.has(d)) {
                    activityMap.set(d, activityMap.get(d)! + 1);
                    totalActivities++;
                }
            }
        });

        // Graph Data (Last 7 Days) for Trend
        const graphData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            graphData.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                progress: activityMap.get(key) || 0
            });
        }

        // Heatmap Data (Last 365 Days)
        const heatmapData = last365Days.map(date => ({
            date,
            count: activityMap.get(date) || 0
        }));

        // Consistency Score
        let activeDays30 = 0;
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if ((activityMap.get(key) || 0) > 0) activeDays30++;
        }
        const consistencyScore = Math.round((activeDays30 / 30) * 100);

        const stats = {
            consistency: consistencyScore,
            completed: todos.filter(t => t.status === 'completed').length + archivedTasks.length,
            pending: todos.filter(t => t.status !== 'completed').length,
            graphData,
            heatmapData
        };

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);

        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }

        if (todo.userId.toString() !== (req as any).user.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        await todo.deleteOne();
        res.json({ message: 'Todo removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
};

