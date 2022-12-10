import { Document, Types } from 'mongoose';

export default interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  role: string;
  address: string;
  _id: Types.ObjectId;

  isValidPassword(password: string): Promise<Error | boolean>;
  createAccountActivationLink(): string;
  createPasswordResetToken(): string;
}
