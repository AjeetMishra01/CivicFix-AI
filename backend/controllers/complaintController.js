import Complaint from '../models/Complaint.js';
import ComplaintStatusHistory from '../models/ComplaintStatusHistory.js';
import Feedback from '../models/Feedback.js';
import axios from "axios";
import Department from '../models/Department.js';
import User from '../models/User.js';

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, address, latitude, longitude, department } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    const aiResponse=await axios.post(
      `${process.env.AI_SERVICE_URL}/predict`,
      { 
        complaint: description 
      }
    );

    const predictedDepartment=await Department.findOne({
      name: aiResponse.data.department
    });

    const predictedSeverity=aiResponse.data.severity;

    if(!predictedDepartment){
      return res.status(404).json({message: "Predicted Department not found"});
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      address,
      latitude,
      longitude,
      imageUrl,
      citizen: req.user._id,
      department: predictedDepartment._id,
      severity: predictedSeverity
    });

    await ComplaintStatusHistory.create({
      complaint: complaint._id,
      status: complaint.status,
      changedBy: req.user._id,
      note: 'Complaint submitted'
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'department') {
      query.department = req.user.department;
    }
    if (req.user.role === 'citizen') {
      query.citizen = req.user._id;
    }

    const complaints = await Complaint.find(query)
      .populate('citizen', 'fullName email')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('citizen', 'fullName email')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'fullName')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, completionImageUrl } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    if (completionImageUrl) complaint.completionImageUrl = completionImageUrl;
    if (req.body.remarks) complaint.remarks.push(req.body.remarks);
    else if (note) complaint.remarks.push(note);
    if (req.user.role === 'department') complaint.assignedOfficer = req.user._id;
    await complaint.save();

    await ComplaintStatusHistory.create({
      complaint: complaint._id,
      status,
      changedBy: req.user._id,
      note
    });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('department', 'name').lean();
    const departments = await Department.find().lean();

    const statusCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.status] = (acc[complaint.status] || 0) + 1;
      return acc;
    }, {});

    const severityCounts = complaints.reduce((acc, complaint) => {
      const severity = complaint.severity || 'Low';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});

    const complaintsOverTime = complaints.reduce((acc, complaint) => {
      const createdAt = complaint.createdAt ? new Date(complaint.createdAt).toISOString().slice(0, 10) : 'Unknown';
      acc[createdAt] = (acc[createdAt] || 0) + 1;
      return acc;
    }, {});

    const departmentStats = departments.map((department) => {
      const departmentComplaints = complaints.filter((complaint) => complaint.department?._id?.toString() === department._id.toString());
      const resolved = departmentComplaints.filter((complaint) => complaint.status === 'resolved').length;
      const pending = departmentComplaints.filter((complaint) => complaint.status !== 'resolved').length;
      const resolutionRate = departmentComplaints.length ? Math.round((resolved / departmentComplaints.length) * 100) : 0;

      return {
        _id: department._id,
        name: department.name,
        totalComplaints: departmentComplaints.length,
        resolvedComplaints: resolved,
        pendingComplaints: pending,
        resolutionRate
      };
    });

    res.json({
      overview: {
        totalComplaints: complaints.length,
        submitted: statusCounts.submitted || 0,
        accepted: statusCounts.accepted || 0,
        inProgress: statusCounts['in-progress'] || 0,
        resolved: statusCounts.resolved || 0,
        highSeverity: severityCounts.High || 0,
        mediumSeverity: severityCounts.Medium || 0,
        lowSeverity: severityCounts.Low || 0
      },
      complaintsByDepartment: departmentStats.map((department) => ({
        name: department.name,
        complaints: department.totalComplaints
      })),
      statusDistribution: [
        { name: 'Submitted', value: statusCounts.submitted || 0 },
        { name: 'Accepted', value: statusCounts.accepted || 0 },
        { name: 'In Progress', value: statusCounts['in-progress'] || 0 },
        { name: 'Resolved', value: statusCounts.resolved || 0 }
      ],
      severityDistribution: [
        { name: 'High', value: severityCounts.High || 0 },
        { name: 'Medium', value: severityCounts.Medium || 0 },
        { name: 'Low', value: severityCounts.Low || 0 }
      ],
      complaintsOverTime: Object.entries(complaintsOverTime).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
      departmentStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.rating = rating;
    complaint.feedback = feedback;
    await complaint.save();

    await Feedback.create({ complaint: complaint._id, citizen: req.user._id, rating, message: feedback });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createComplaint, getComplaints, getAllComplaints, updateComplaintStatus, getAnalytics, submitFeedback };
