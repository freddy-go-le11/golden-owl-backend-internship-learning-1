import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/common/constants';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { CustomizeJwtService } from 'src/jwt/jwt.service';
import { TAuthRequest } from 'src/types/types';
import { getCookieOptions } from 'src/common/functions';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: CustomizeJwtService) {}

  use(req: TAuthRequest, res: Response, next: NextFunction) {
    const refreshToken = req.cookies[COOKIE_REFRESH_TOKEN_KEY];
    if (!refreshToken) {
      this.clearCookies(res);
    } else {
      this.handleAccessToken(req, res, refreshToken);
    }

    next();
  }

  private clearCookies(res: Response) {
    res.clearCookie(COOKIE_REFRESH_TOKEN_KEY);
    res.clearCookie(COOKIE_ACCESS_TOKEN_KEY);
  }

  private handleAccessToken(
    req: TAuthRequest,
    res: Response,
    refreshToken: string,
  ) {
    let accessToken = req.cookies[COOKIE_ACCESS_TOKEN_KEY];
    if (!accessToken) {
      accessToken =
        this.jwtService.getAccessTokenFromRefreshToken(refreshToken);
      res.cookie(
        COOKIE_ACCESS_TOKEN_KEY,
        accessToken,
        getCookieOptions({ expiresInDays: 1 }),
      );
    }

    req.auth = this.jwtService.verifyAccessToken(accessToken);
  }
}
