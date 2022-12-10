import User from '@/resources/user/user.interface';
import { Document, Types } from 'mongoose';

export default interface Task extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  deadLine: Date;
  completionDate: Date;
  status: string;
  check: string;
  assignedBy: User;
  assignedTo: User;
}
