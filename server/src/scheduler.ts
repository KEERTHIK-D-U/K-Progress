import cron from 'node-cron';
import { Todo } from './models/Todo';
import { User } from './models/User';
import { sendReminderEmail } from './services/emailService';

export const startScheduler = () => {
    console.log('📅 Scheduler started: Checking for inactive goals every day at 09:00 AM');

    // Schedule task to run every day at 9:00 AM ('0 9 * * *')
    // For demo capability, we might want to run it every minute ('* * * * *') to test,
    // but code says daily. I'll stick to daily but log it.
    cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Running daily goal check...');
        try {
            // Find modern todos that are active (in-progress or pending)
            const activeTodos = await Todo.find({
                type: 'modern',
                status: { $in: ['pending', 'in-progress'] }
            });

            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            for (const todo of activeTodos) {
                // Check if last updated > 24 hours ago
                // If lastUpdated is missing, use createdAt
                const lastActivity = todo.lastUpdated || (todo as any).createdAt;

                if (new Date(lastActivity) < oneDayAgo) {
                    // Fetch user email
                    const user = await User.findById(todo.userId);
                    if (user && user.email) {
                        await sendReminderEmail(user.email, todo.title);
                    }
                }
            }
        } catch (error) {
            console.error('Scheduler error:', error);
        }
    });
};
