import { HTTPCodes } from '../../utils/helpers/response';
import HttpException from '@/utils/exceptions/http.exception';
import validate from '@/resources/task/task.validation';
import validationMiddleware from '@/middleware/validation.middleware';
import Controller from '@/utils/interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import TaskService from '@/resources/task/task.service';

class TaskController implements Controller {
  public path = '/tasks';
  public router = Router();
  private TaskService = new TaskService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.addNewTask),
      this.newTask
    );
    this.router.get(`${this.path}/random/:id`, this.random);
    this.router.get(`${this.path}`, this.getAllTasks);
    this.router.get(`${this.path}/:id`, this.getTask);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(validate.updateTask),
      this.updateTask
    );
    this.router.delete(`${this.path}/:id`, this.deleteTask);
  }

  private newTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const task = await this.TaskService.addTask(req.body);
      res.status(HTTPCodes.OK).json({ task });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };
  private random = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const tasks = await this.TaskService.random(req.params.id);
      res.status(HTTPCodes.OK).json({ results: tasks.length, tasks });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private getAllTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log('Tasks');
      const tasks = await this.TaskService.getAllTasks();

      if (tasks && tasks.length === 0)
        return res
          .status(HTTPCodes.NOT_FOUND)
          .json({ message: 'No resource found in DB' });

      res.status(HTTPCodes.OK).json({ tasks });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private getTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const task = await this.TaskService.getTask(req.params.id);
      if (!task)
        return res
          .status(HTTPCodes.NOT_FOUND)
          .json({ message: 'Resource not found against the Id provided' });
      res.status(HTTPCodes.OK).json({ task });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const task = await this.TaskService.updateTask(req.params.id, req.body);
      if (!task)
        new HttpException(
          HTTPCodes.NOT_FOUND,
          'Resource not found against the Id provided'
        );

      res.status(HTTPCodes.OK).json({ task });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const task = await this.TaskService.deleteTask(req.params.id);
      // if (!task)
      //   new HttpException(
      //     HTTPCodes.NOT_FOUND,
      //     'Resource not found against the Id provided'
      //   );

      res.status(HTTPCodes.OK).json({ task });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };
}

export default TaskController;
