import { HTTPCodes } from './../../utils/helpers/response';
import mongoose from 'mongoose';
import UserModel from '@/resources/user/user.model';
import User from '@/resources/user/user.interface';
import validate from '@/resources/user/user.validation';
import validateObjectId from '@/utils/helpers/dbHelper';
// ^ Component, basically where we do the DB interaction

class UserService {
  private User = UserModel;

  public async addUser(body: Body): Promise<User> {
    try {
      const user = await this.User.create({ ...body });
      return user;
    } catch (e: any) {
      throw new Error(`Unable to create user : ${e.message}`);
    }
  }

  public async getUser(id: string): Promise<User | null> {
    try {
      const user = await this.User.findById(id);

      return user;
    } catch (e: any) {
      throw new Error('User not found');
    }
  }

  public async getAllUsers(): Promise<User[] | null> {
    try {
      const users = await this.User.find({
        role: { $ne: 'admin' },
      }).select('-createdAt -updatedAt');

      return users;
    } catch (e: any) {
      throw new Error('Nothing to show');
    }
  }

  public async getMe(userId: mongoose.Types.ObjectId): Promise<User | null> {
    try {
      console.log('In Service');

      const user = await this.User.findById(userId).select(
        '-createdAt, -updatedAt'
      );
      return user;
    } catch (e: any) {
      throw new Error(`Un authorized ${e}`);
    }
  }

  public async updateUser(id: string, body: Body): Promise<User | null> {
    try {
      validateObjectId(id);

      const updUser = await this.User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      return updUser;
    } catch (e: any) {
      throw new Error(`Unable to get user : ${e.message}`);
    }
  }

  public async deleteTask(id: string): Promise<User | null> {
    try {
      const user = await this.User.findByIdAndDelete(id);
      return user;
    } catch (e: any) {
      throw new Error(`Unable to get user of id ${id} : ${e.message}`);
    }
  }
}

export default UserService;
