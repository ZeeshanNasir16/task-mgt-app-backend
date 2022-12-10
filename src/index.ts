import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import UserController from '@/resources/user/user.controller';
import AuthController from '@/resources/auth/auth.controller';
import ProjectController from '@/resources/project/project.controller';
import TaskController from '@/resources/task/task.controller';

validateEnv();

const app = new App(
  [
    new UserController(),
    new AuthController(),
    new ProjectController(),
    new TaskController(),
  ],
  Number(process.env.PORT)
);
app.listen();
