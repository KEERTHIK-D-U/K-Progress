import dotenv from 'dotenv';
import app from './app';
import { startScheduler } from './scheduler';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Scheduler
// Note: This works for the persistent server process (local dev or traditional hosting).
// In Vercel serverless, this entry point might not be used or the scheduler won't persist.
startScheduler();

app.get('/', (req, res) => {
    res.send('AI Todo Tracker API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
