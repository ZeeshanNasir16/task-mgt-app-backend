import Project from '@/resources/project/Project.interface';
import mongoose from 'mongoose';

const baseOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const ProjSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project decription is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    deadlineDate: {
      type: Date,
      required: true,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['incompleted', 'completed'],
      default: 'incompleted',
    },
  },
  baseOptions
);

ProjSchema.pre(/^find/, function (next) {
  this.populate('assignedTo');
  next();
});

export default mongoose.model<Project>('Project', ProjSchema);
