import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    location: { type: String, required: true },
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    imageUrl: { type: String },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    status: {
      type: String,
      enum: ['submitted', 'accepted', 'in-progress', 'resolved'],
      default: 'submitted'
    },
    severity: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low'
    },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: [{ type: String }],
    completionImageUrl: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
