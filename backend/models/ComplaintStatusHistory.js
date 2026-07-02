import mongoose from 'mongoose';

const complaintStatusHistorySchema = new mongoose.Schema(
  {
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    status: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('ComplaintStatusHistory', complaintStatusHistorySchema);
