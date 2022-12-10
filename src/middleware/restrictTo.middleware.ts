import { HTTPCodes } from './../utils/helpers/response';
import HttpException from '@/utils/exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';
function RestrictTo(role: [string]) {
  //  roles is an array like ['admin','lead-guide'] using res-parameter syntax
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('req.user', req.body.user);
    if (!role.includes(req.body.user.role)) {
      return next(
        new HttpException(
          HTTPCodes.FORBIDDEN,
          ' you do not have permission to perform this action'
        )
      );
    }
    next();
  };
}

export default RestrictTo;
