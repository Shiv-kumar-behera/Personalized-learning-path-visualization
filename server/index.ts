import { Router, Request, Response } from 'express';
import User from '../models/User.js';

const router = Router();

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

router.post('/proactive-recommendation', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  getUserProgress(userId).then(progress => {
    const recommendations = generateRecommendations(progress);

    let message: string;
    if (progress < 50) {
      message = `Hi! I noticed you're just getting started. Here are some courses to help you progress: ${recommendations.join(', ')}`;
    } else {
      message = `Great job on your progress! Based on your learning so far, you might enjoy: ${recommendations.join(', ')}`;
    }

    res.json({ message, recommendations });
  }).catch(error => {
    res.status(500).json({ error: 'Server error' });
  });
});

export default router;
