import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/auth/auth.validation';
import authenticated from '@/middleware/authenticated.middleware';
import { HTTPCodes } from '@/utils/helpers/response';
import AuthService from './auth.service';
// import { sendMail } from '@/utils/helpers/email';

class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private AuthService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.Login),
      this.login
    );

    // ! for testing purposes
    this.router.post(
      `${this.path}/admin`,
      validationMiddleware(validate.Admin),
      this.createAdmin
    );
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.AuthService.Login(email, password);

      res.status(HTTPCodes.OK).json({
        user,
        token,
      });
    } catch (e: any) {
      return next(new HttpException(HTTPCodes.BAD_REQUEST, e.message));
    }
  };

  //   ! testing purposes
  private createAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const admin = await this.AuthService.CreateAdmin(req.body);
      res.status(HTTPCodes.CREATED).json({
        status: 'created',
        admin,
      });
    } catch (e: any) {
      return next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };
}

export default AuthController;
