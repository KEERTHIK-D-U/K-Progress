import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter
// For demo purposes, we will try to use a dummy account or rely on environment variables.
// If no vars provided, we log only.
const transporter = nodemailer.createTransport({
    service: 'gmail', // Simplest for demo if user has creds
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendReminderEmail = async (to: string, goalTitle: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[Mock Email] To: ${to} | Subject: Reminder: ${goalTitle} | Body: You haven't updated your progress lately!`);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: `Action Required: Updates needed on "${goalTitle}"`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Keep the momentum going! 🚀</h2>
                    <p>Hi there,</p>
                    <p>We noticed you haven't updated your progress on <strong>${goalTitle}</strong> in the last 24 hours.</p>
                    <p>Consistency is key to success. Take 5 minutes to check in or complete a milestone today!</p>
                    <a href="http://localhost:5173" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Check in Now</a>
                    <p style="margin-top: 20px; color: #888; font-size: 12px;">- The K Progress Team</p>
                </div>
            `
        });
        console.log(`Email sent to ${to} for goal ${goalTitle}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}`, error);
    }
};
