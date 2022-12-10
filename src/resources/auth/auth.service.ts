import { HTTPCodes } from './../../utils/helpers/response';
import moongoose from 'mongoose';
import UserModel from '@/resources/user/user.model';
import validation from '@/resources/auth/auth.validation';
import User from '@/resources/user/user.interface';
import token from '@/utils/token';

class AuthService {
  private user = UserModel;

  public async Login(email: string, password: string): Promise<any | Error> {
    try {
      const user = await this.user.findOne({ email }).select('+password');
      if (!user) throw new Error('Unable to find user with that email address');

      if (await user.isValidPassword(password))
        return { token: token.createToken(user), user };
      else throw new Error('Password does not match');
    } catch (e: any) {
      throw new Error(e.message || 'Unable to login');
    }
  }

  public async CreateAdmin(body: Body): Promise<any | Error> {
    try {
      const admin = await this.user.create(body);
      return { admin };
    } catch (e: any) {
      throw new Error(e.message || 'Unable to Create Admin');
    }
  }
}
export default AuthService;
