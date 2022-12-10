import mongoose from 'mongoose';
import User from '@/resources/user/user.interface';
import bcrypt from 'bcrypt';

const baseOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required!'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'PasswordConfirm is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'user'],
      default: 'user',
    },
    address: {
      type: String,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: 'Project',
    },
    // isActivated: {
    //   type: Boolean,
    //   default: false,
    // },
    activationLink: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  baseOptions
  // {
  //   timestamps: true,
  //   toJSON: {
  //     virtuals: true,
  //     transform: function (doc, ret, options) {
  //       ret.id = ret._id;
  //       delete ret._id;
  //       delete ret.password;
  //       // delete ret.__v;
  //       return ret;
  //     },
  //   },
  //   toObject: {
  //     virtuals: true,
  //     transform: function (doc, ret, options) {
  //       ret.id = ret._id;
  //       delete ret._id;
  //       delete ret.password;
  //       delete ret.__v;
  //       return ret;
  //     },
  //   },
  // }
);

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ^ Encrypt the password if modified or before saving data
UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  if (!(this.password === this.passwordConfirm)) {
    throw Error('Password and Password Confirm are not same');
  }

  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  this.passwordConfirm = '';

  next();
});

// ^ Validate the password
UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<User>('User', UserSchema);
