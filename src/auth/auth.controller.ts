import { AuthService } from './auth.service';
import { UserExceptionFilter } from 'src/users/users.exception';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseFilters,
  Res,
} from '@nestjs/common';
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

  @Post('login')
  async login(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(userLoginDTO);

    const currentDate = new Date();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: true,
      path: '/',
      sameSite: 'none',
      expires: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 1),
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: true,
      path: '/',
      sameSite: 'none',
      expires: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 7),
    });

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
    console.log('🚀 ~ AuthController ~ refreshToken:', refreshToken);
    if (!refreshToken)
      throw new BadRequestException('No refresh token provided');
    const accessToken = req.cookies['accessToken'];
    if (accessToken) return;

    const newAccessToken =
      this.jwtService.getAccessTokenFromRefreshToken(refreshToken);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: false,
      secure: true,
      path: '/',
      sameSite: 'none',
    });

    return res;
  }
}
