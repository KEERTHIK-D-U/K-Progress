
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User';
import { connectDB } from './config/db';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        const email = 'demo@gmail.com';
        const password = 'password123';
        const name = 'Demo User';

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Demo user already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name,
                email,
                password: hashedPassword,
                preferences: {
                    reminderTime: '09:00',
                    whatsappEnabled: false,
                    emailEnabled: true,
                    theme: 'light'
                }
            });
            console.log('Demo user created successfully');
        }

        // Create seed data
        const demoUser = await User.findOne({ email: 'demo@gmail.com' });
        if (demoUser) {
            // Seed Long Term Tasks
            const LongTermTask = require('./models/LongTermTask').LongTermTask;
            await LongTermTask.deleteMany({ userId: demoUser._id });

            await LongTermTask.create([
                {
                    userId: demoUser._id,
                    title: 'Master React Native',
                    description: 'Build a mobile app from scratch',
                    startDate: new Date('2023-01-15'),
                    completedAt: new Date('2023-03-20'),
                    learning: 'Learned about native bridges and performance optimization.'
                },
                {
                    userId: demoUser._id,
                    title: 'Read 12 Books',
                    description: 'Read one book per month',
                    startDate: new Date('2023-01-01'),
                    completedAt: new Date('2023-12-25'),
                    learning: 'Consistency is key. 30 mins a day is enough.'
                }
            ]);

            console.log('Seed data updated');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

seedData();
