import { Document, Types } from 'mongoose';

export default interface Project extends Document {
  title: string;
  description: string;
  startDate: Date;
  deadlineDate: Date;
  status: string;
  _id: Types.ObjectId;
}
