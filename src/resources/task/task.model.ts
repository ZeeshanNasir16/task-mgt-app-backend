import Task from '@/resources/task/task.interface';
import { NextFunction } from 'express';
import mongoose from 'mongoose';

const baseOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter task name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    deadLine: {
      type: Date,
      requires: [true, 'must have a deadline of task'],
    },
    completionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['todo', 'inProgress', 'review', 'completed'],
      default: 'todo',
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: 'Project',
    },
    assignedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    assignedTo: {
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
      date: Date,
    },
    check: {
      type: String,
      enum: ['unAssigned', 'assigned'],
      default: 'unAssigned',
    },
  },
  baseOptions
);

// * Populate Manager's Name
taskSchema.pre<Task>(/^find/, function (next) {
  this.populate([
    {
      path: 'assignedTo',
      populate: {
        path: 'user',
        select: 'firstName lastName email _id',
      },
    },
    {
      path: 'assignedBy',
      select: 'firstName lastName email _id',
    },
  ]);

  next();
});

taskSchema.post('save', function (doc, next) {
  doc
    .populate([
      {
        path: 'assignedTo',
        populate: {
          path: 'user',
          select: 'firstName lastName email _id',
        },
      },
      {
        path: 'assignedBy',
        select: 'firstName lastName email _id',
      },
    ])
    .then(function () {
      next();
    });
});

// taskSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'task',
//   localField: '_id',
// });

export default mongoose.model<Task>('Task', taskSchema);
