import { AuthService } from './auth.service';
import { UserExceptionFilter } from 'src/users/users.exception';
import { Body, Controller, Post, Req, UseFilters, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDTO, UserRegisterDTO } from './dto';
import { CustomizeJwtService } from 'src/jwt/jwt.service';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/common/constants';
import { TAuthRequest } from 'src/types/types';
import { getCookieOptions } from 'src/common/functions';

@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: CustomizeJwtService,
  ) {}

  @Post('register')
  register(@Body() userRegisterDTO: UserRegisterDTO) {
    return this.authService.register(userRegisterDTO);
  }

  setCookie(
    @Res({ passthrough: true }) res: Response,
    name: string,
    value: string,
    expiresInDays: number,
  ) {
    res.cookie(name, value, getCookieOptions({ expiresInDays }));
  }

  @Post('login')
  async login(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(userLoginDTO);

    this.setCookie(res, COOKIE_ACCESS_TOKEN_KEY, accessToken, 1);
    this.setCookie(res, COOKIE_REFRESH_TOKEN_KEY, refreshToken, 7);
    return;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_REFRESH_TOKEN_KEY);
    res.clearCookie(COOKIE_ACCESS_TOKEN_KEY);
    return;
  }

  @Post('access-token')
  async accessToken() {}

  @Post('session')
  async session(@Req() req: TAuthRequest) {
    return req.auth;
  }
}
