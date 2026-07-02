import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('complaint').populate('citizen', 'fullName');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
