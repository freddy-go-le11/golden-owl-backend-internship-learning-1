import { AuthService } from './auth.service';
import { UserExceptionFilter } from 'src/users/users.exception';
import {
  Body,
  Controller,
  Post,
  Req,
  UseFilters,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDTO, UserRegisterDTO } from './dto';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/common/constants';
import { TAuthRequest } from 'src/types/types';
import { getCookieOptions } from 'src/common/functions';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(new AuthGuard(false))
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

  handleSuccessLogin(
    @Res({ passthrough: true }) res: Response,
    {
      session,
      accessToken,
      refreshToken,
    }: Awaited<ReturnType<AuthService['login']>>,
  ) {
    this.setCookie(res, COOKIE_ACCESS_TOKEN_KEY, accessToken, 1);
    this.setCookie(res, COOKIE_REFRESH_TOKEN_KEY, refreshToken, 7);
    return session;
  }

  @Post('login')
  @UseGuards(new AuthGuard(false))
  async login(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(userLoginDTO);
    return this.handleSuccessLogin(res, data);
  }

  @Post('/login/google')
  @UseGuards(new AuthGuard(false))
  async googleLogin(
    @Body('access_token') googleAccessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data =
      await this.authService.loginOrCreateUserViaGoogle(googleAccessToken);
    return this.handleSuccessLogin(res, data);
  }

  @Post('logout')
  @UseGuards(new AuthGuard(true))
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_REFRESH_TOKEN_KEY);
    res.clearCookie(COOKIE_ACCESS_TOKEN_KEY);
    return {
      metadata: {
        message: 'Logout Successful',
      },
    };
  }

  @Post('access-token')
  async accessToken() {}

  @Post('session')
  async session(@Req() req: TAuthRequest) {
    return req.auth;
  }
}
