import bcrypt from 'bcryptjs';
import Department from '../models/Department.js';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    const departmentIds = departments.map((dept) => dept._id);
    const employeeCounts = await User.aggregate([
      { $match: { role: 'department', department: { $in: departmentIds } } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const countMap = employeeCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const departmentResults = departments.map((dept) => ({
      ...dept.toObject(),
      employeeCount: countMap[dept._id.toString()] || 0
    }));

    res.json(departmentResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDepartmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const employees = await User.find({ role: 'department', department: id }).select('fullName email role');
    res.json({ department, employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOfficer = async (req, res) => {
  try {
    const { fullName, email, password, department, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'department',
      department,
      phone
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const officer = await User.findById(id);
    if (!officer) return res.status(404).json({ message: 'Officer not found' });
    await officer.deleteOne();
    res.json({ message: 'Officer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const linkedComplaints = await Complaint.countDocuments({ department: id });
    if (linkedComplaints > 0) return res.status(400).json({ message: 'Cannot delete department with assigned complaints' });

    await User.deleteMany({ role: 'department', department: id });
    await department.deleteOne();
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getDepartments, getDepartmentDetails, createDepartment, createOfficer, deleteOfficer, deleteDepartment };
