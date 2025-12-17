import React, { useEffect } from 'react';
import { useTodo } from '../context/TodoContext';

const NotificationManager: React.FC = () => {
    const { todos } = useTodo();

    useEffect(() => {
        // Request permission on mount
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            
            todos.forEach(todo => {
                if (todo.status === 'completed' || todo.status === 'archived') return;
                if (!todo.reminderEnabled) return;

                // Determine due date
                let dueDate: Date | null = null;
                if (todo.type === 'traditional' && todo.dueDate) {
                    dueDate = new Date(todo.dueDate);
                } else if (todo.type === 'modern' && todo.targetDate) {
                    dueDate = new Date(todo.targetDate);
                }

                if (dueDate) {
                    // Check if due within the last minute (to avoid spamming, but simplify for now)
                    // Logic: If current time matches due time (ignoring seconds/ms for broad match)
                    // Or simpler: If now > due AND we haven't notified? 
                    // We don't have a 'notified' flag in Todo. 
                    // Let's just check if it's due *today* for now, or match specific time?
                    // User probably wants "Today" reminders.
                    
                    // const timeDiff = dueDate.getTime() - now.getTime();
                    // const isDueSoon = timeDiff > 0 && timeDiff < 60 * 60 * 1000; // Due in next hour
                    // const isOverdue = timeDiff < 0 && timeDiff > -60 * 60 * 1000; // Overdue by less than hour (recent)

                    // For this simple monitor, let's notify if it's the *same day* and we haven't checked recently.
                    const isSameDay = 
                        dueDate.getDate() === now.getDate() &&
                        dueDate.getMonth() === now.getMonth() &&
                        dueDate.getFullYear() === now.getFullYear();

                    if (isSameDay) {
                         // We need a way to not spam. 
                         // Use SessionStorage to track "notified_id" for this session?
                         const notifiedKey = `notified_${todo._id}_${now.toDateString()}`;
                         if (!sessionStorage.getItem(notifiedKey)) {
                             new Notification(`Task Reminder: ${todo.title}`, {
                                 body: `This task is due today!`,
                                 icon: '/logo.png' // generic icon if available
                             });
                             sessionStorage.setItem(notifiedKey, 'true');
                         }
                    }
                }
            });
        };

        // Check every minute
        const intervalId = setInterval(checkReminders, 60 * 1000);
        checkReminders(); // checking on mount/update too

        return () => clearInterval(intervalId);
    }, [todos]);

    return null; // Renderless component
};

export default NotificationManager;
