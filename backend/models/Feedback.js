import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
