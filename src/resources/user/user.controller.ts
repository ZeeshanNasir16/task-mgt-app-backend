import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import HttpException from '@/utils/exceptions/http.exception';
import validate from '@/resources/user/user.validation';
import validationMiddleware from '@/middleware/validation.middleware';
import UserService from '@/resources/user/user.service';
import { HTTPCodes } from '@/utils/helpers/response';
import catchAsync from '@/middleware/catchAsync';
import authenticatedMiddleware from '@/middleware/authenticated.middleware';

// ^ for handling routes and handling validation of request data before saving to DB

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.addNewEmployee),
      this.newUser
    );
    this.router.get(`${this.path}/me`, authenticatedMiddleware, this.getMe);
    this.router.get(`${this.path}/:id`, this.getSingleUser);
    this.router.get(`${this.path}/`, this.getUsers);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(validate.updateUser),
      this.updateUser
    );
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  private newUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.UserService.addUser(req.body);
      res.status(HTTPCodes.CREATED).json({ user });
    } catch (e: any) {
      // console.log('Add User Error :', e);
      next(new HttpException(HTTPCodes.NOT_AUTHORIZED, e.message));
    }
  };

  private getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.UserService.getMe(req.body.user.id);
      if (!user)
        return res.status(HTTPCodes.NOT_FOUND).json({
          status: 'Not found',
          message: 'No User found against this id',
        });

      res.status(HTTPCodes.OK).json({ user });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.NOT_FOUND, e.message));
    }
  };

  private getSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      const user = await this.UserService.getUser(id);
      if (!user)
        return res.status(HTTPCodes.NOT_FOUND).json({
          status: 'Not found',
          message: 'Record not found',
        });

      res.status(HTTPCodes.OK).json({
        user,
      });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.NOT_FOUND, e.message));
    }
  };

  private getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const users = await this.UserService.getAllUsers();
      res.status(HTTPCodes.OK).json({ users });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.NOT_AUTHORIZED, e.message));
    }
  };

  private updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.UserService.updateUser(req.params.id, req.body);
      if (!user)
        new HttpException(
          HTTPCodes.NOT_FOUND,
          'Resource not found against the Id provided'
        );

      res.status(HTTPCodes.OK).json({ user });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.UserService.deleteTask(req.params.id);
      res.status(HTTPCodes.OK).json({ user });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };
}

export default UserController;
