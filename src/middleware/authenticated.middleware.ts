import Token from '@/utils/interfaces/token.interface';
import { HTTPCodes } from '../utils/helpers/response';
import HttpException from '@/utils/exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';
import token from '@/utils/token';
import jwt from 'jsonwebtoken';
import userModel from '@/resources/user/user.model';

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  //   ^ Checks if token exists in request or not
  if (!bearer || !bearer.startsWith('Bearer '))
    return next(
      new HttpException(
        HTTPCodes.NOT_AUTHORIZED,
        "You're not authorized to do this"
      )
    );

  //   ^ Verify if token is correct or not
  const accessToken = bearer.split('Bearer ')[1].trim();

  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );

    if (payload instanceof jwt.JsonWebTokenError)
      return next(
        new HttpException(
          HTTPCodes.NOT_AUTHORIZED,
          "You're not authorized to do this"
        )
      );

    //   ^ Get the user using token
    const user = await userModel
      .findById(payload.id)
      .select('-password')
      .exec();

    if (!user)
      return next(
        new HttpException(
          HTTPCodes.NOT_AUTHORIZED,
          'The user belong to this token does not exists'
        )
      );

    req.body.user = user;

    return next();
  } catch (e) {
    // console.log(e);
    return next(new HttpException(HTTPCodes.NOT_AUTHORIZED, 'Un-authorized'));
  }
}

export default authenticatedMiddleware;
