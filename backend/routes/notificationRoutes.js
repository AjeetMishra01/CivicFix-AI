import express from 'express';
import { createNotification, listNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), createNotification);
router.get('/', protect, listNotifications);
router.put('/:id/read', protect, markNotificationRead);

export default router;
