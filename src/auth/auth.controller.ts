import { AuthService } from './auth.service';
import { UserExceptionFilter } from 'src/users/users.exception';
import { Body, Controller, Post, Req, UseFilters, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserLoginDTO, UserRegisterDTO } from './dto';
import { CustomizeJwtService } from 'src/jwt/jwt.service';

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
    res.cookie(name, value, {
      httpOnly: false,
      secure: true,
      path: '/',
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * expiresInDays),
    });
  }

  @Post('login')
  async login(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(userLoginDTO);

    this.setCookie(res, 'accessToken', accessToken, 1);
    this.setCookie(res, 'refreshToken', refreshToken, 7);
    return;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return;
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    const newAccessToken =
      this.jwtService.getAccessTokenFromRefreshToken(refreshToken);

    this.setCookie(res, 'accessToken', newAccessToken, 1);
    return res;
  }
}
