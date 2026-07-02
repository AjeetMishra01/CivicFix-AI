import Complaint from '../models/Complaint.js';
import ComplaintStatusHistory from '../models/ComplaintStatusHistory.js';
import Feedback from '../models/Feedback.js';
import axios from "axios";
import Department from '../models/Department.js';

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, address, latitude, longitude, department } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    const aiResponse=await axios.post(
      "http://127.0.0.1:8000/predict",
      { 
        complaint: description 
      }
    );
    console.log(aiResponse.data);

    const predictedDepartment=await Department.findOne({
      name: aiResponse.data.department
    });

    console.log("Department Found:", predictedDepartment);

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
      department: predictedDepartment._id
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

export { createComplaint, getComplaints, getAllComplaints, updateComplaintStatus, submitFeedback };
