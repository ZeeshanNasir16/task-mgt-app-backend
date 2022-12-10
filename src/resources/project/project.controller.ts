import { HTTPCodes } from './../../utils/helpers/response';
import HttpException from '@/utils/exceptions/http.exception';
import validate from '@/resources/project/project.validation';
import validationMiddleware from '@/middleware/validation.middleware';
import Controller from '@/utils/interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import ProjectService from '@/resources/project/project.service';

class ProjectController implements Controller {
  public path = '/projects';
  public router = Router();
  private ProjectService = new ProjectService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.addNewProject),
      this.newProject
    );
    this.router.get(`${this.path}`, this.getAllProjects);
    this.router.get(`${this.path}/:id`, this.getProject);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(validate.updateProject),
      this.updateProject
    );
    this.router.delete(`${this.path}/:id`, this.deleteProj);
  }

  private newProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const project = await this.ProjectService.addProj(req.body);
      res.status(HTTPCodes.OK).json({ project });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private getAllProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const projects = await this.ProjectService.getAllProj();
      res.status(HTTPCodes.OK).json({ projects });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private getProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const proj = await this.ProjectService.getProject(req.params.id);
      if (!proj)
        return res
          .status(HTTPCodes.NOT_FOUND)
          .json({ message: 'Resource not found against the Id provided' });
      res.status(HTTPCodes.OK).json({ proj });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const proj = await this.ProjectService.updateProject(
        req.params.id,
        req.body
      );
      if (!proj)
        return next(
          new HttpException(
            HTTPCodes.NOT_FOUND,
            'Resource not found against the Id provided'
          )
        );

      res.status(HTTPCodes.OK).json({ proj });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };

  private deleteProj = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const proj = await this.ProjectService.deleteProj(req.params.id);
      if (!proj)
        return res
          .status(HTTPCodes.NOT_FOUND)
          .json({ message: 'Resource not found against the Id provided' });
      res.status(HTTPCodes.OK).json({ proj });
    } catch (e: any) {
      next(new HttpException(HTTPCodes.SERVER_ERROR, e.message));
    }
  };
}

export default ProjectController;
