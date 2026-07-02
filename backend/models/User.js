import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['citizen', 'department', 'admin'],
      default: 'citizen'
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    phone: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
