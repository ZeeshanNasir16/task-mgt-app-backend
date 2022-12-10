import { Request, Response, NextFunction } from 'express';
import HttpExceptions from '@/utils/exceptions/http.exception';

function errorMiddleware(
  error: HttpExceptions,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  // console.log('Error middleware', error);

  let err = { ...error };
  err.message = error.message;
  console.log('Error :', err);

  res.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
