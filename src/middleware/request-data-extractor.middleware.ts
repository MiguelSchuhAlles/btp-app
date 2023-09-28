import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RequestDataExtractorMiddleware implements NestMiddleware {
  async use(req, res: Response, next: NextFunction) {
    const authHeader = req.header('authorization');

    if (!authHeader) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }

    const bearerToken: string[] = authHeader.split(' ');
    const token: string = bearerToken[1];

    const { userId, userName } = this.extractRequestData(token);

    req.user = {
        userId,
        userName
    };

    next();
  }

  extractRequestData(token: string) {
    const decodedJwt = jwt.decode(token);

    const userId = decodedJwt.user_id;
    const userName = decodedJwt.user_name;
    
    return { userId, userName };
}
}