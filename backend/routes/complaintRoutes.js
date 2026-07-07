import express from 'express';
import {
  createComplaint,
  getComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getAnalytics,
  submitFeedback
} from '../controllers/complaintController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/', protect, getComplaints);
router.get('/all', protect, authorizeRoles('admin'), getAllComplaints);
router.get('/analytics', protect, authorizeRoles('admin'), getAnalytics);
router.put('/:id/status', protect, updateComplaintStatus);
router.post('/:id/feedback', protect, submitFeedback);

export default router;
