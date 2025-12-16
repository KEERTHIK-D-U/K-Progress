
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generatePlan = async (req: Request, res: Response) => {
    try {
        const { goal, duration, preference } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            // Fallback for demo if no key provided
            console.warn('No GEMINI_API_KEY found. using mock response.');
            const mockMilestones = [
                { title: 'Research Basics', description: 'Understand the core concepts', deadline: new Date(Date.now() + 86400000) },
                { title: 'First Practice', description: 'Apply what you learned', deadline: new Date(Date.now() + 172800000) },
                { title: 'Review & Refine', description: 'Check progress and improve', deadline: new Date(Date.now() + 259200000) }
            ];
            res.json({ milestones: mockMilestones });
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            I want to achieve the goal: "${goal}" in "${duration}".
            My learning preference is: "${preference || 'standard'}".
            
            Break this down into a list of specific, actionable milestones/tasks with estimated deadlines relative to today.
            Return ONLY a valid JSON object with the following structure:
            {
                "milestones": [
                    {
                        "title": "Task Title",
                        "description": "Brief description of the task",
                        "deadline": "ISO-8601 Date String (e.g., 2023-10-27T10:00:00.000Z)"
                    }
                ]
            }
            Do not include any markdown formatting or explanations, just the JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            // Clean up potentially md formatted text
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const plan = JSON.parse(cleanedText);
            res.json(plan);
        } catch (e) {
            console.error('Failed to parse AI response', text);
            res.status(500).json({ message: 'Failed to generate plan format' });
        }

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: 'Error generating plan', error: (error as Error).message });
    }
};
