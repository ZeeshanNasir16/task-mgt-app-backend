import HttpException from '@/utils/exceptions/http.exception';
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';
import cors from 'cors';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // this.express.use(helmet());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors());
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
    this.express.all('*', (req: Request, res: Response, next: NextFunction) =>
      next(
        new HttpException(
          404,
          `Can't find route : ${req.originalUrl} on this server!`
        )
      )
    );
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private initializeDatabaseConnection(): void {
    const { MONGO_PATH, MONGO_USER, MONGO_PASSWORD } = process.env;
    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`)
      .then(() => {
        console.log('DB Connected Successfully');
      })
      .catch((err) => {
        console.log('DB Connection Failed');
      });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App running on port ${this.port}`);
    });
  }
}

export default App;
