import express from 'express';
import {
  getDepartments,
  getDepartmentDetails,
  createDepartment,
  createOfficer,
  deleteOfficer,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartmentDetails);
router.post('/', protect, authorizeRoles('admin'), createDepartment);
router.post('/officers', protect, authorizeRoles('admin'), createOfficer);
router.delete('/officers/:id', protect, authorizeRoles('admin'), deleteOfficer);
router.delete('/:id', protect, authorizeRoles('admin'), deleteDepartment);

export default router;
