import { Router, Request, Response } from 'express';
import User from '../models/User'; // import the User model

const router = Router();

// Fetch user progress from the database
async function getUserProgress(userId: string): Promise<number> {
    const user = await User.findOne({ userId });
    return user ? user.progress : 0;
}

function generateRecommendations(progress: number): string[] {
    if (progress < 50) {
        return ['Intro to TypeScript', 'Basic JavaScript Concepts'];
    } else {
        return ['Advanced Node.js', 'AI Chatbot Design'];
    }
}

router.post('/proactive-recommendation', async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const progress = await getUserProgress(userId);
        const recommendations = generateRecommendations(progress);

        let message: string;
        if (progress < 50) {
            message = `Hi! I noticed you're just getting started. Here are some courses to help you progress: ${recommendations.join(', ')}`;
        } else {
            message = `Great job on your progress! Based on your learning so far, you might enjoy: ${recommendations.join(', ')}`;
        }

        return res.json({ message, recommendations });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

export default router;
