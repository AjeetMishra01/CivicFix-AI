import Notification from '../models/Notification.js';
import Department from '../models/Department.js';

const createNotification = async (req, res) => {
  try {
    const { title, message, department } = req.body;

    const notification = await Notification.create({
      title,
      message,
      department: department || null,
      createdBy: req.user._id
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listNotifications = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'department') {
      query.$or = [{ department: null }, { department: req.user.department }];
    }

    const notifications = await Notification.find(query)
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createNotification, listNotifications, markNotificationRead };
