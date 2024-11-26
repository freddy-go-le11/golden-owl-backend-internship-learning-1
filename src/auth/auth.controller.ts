import { AuthService } from './auth.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDTO, UserRegisterDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegisterDTO: UserRegisterDTO) {
    await this.authService.register(userRegisterDTO);
    return;
  }

  @Post('login')
  async login(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(userLoginDTO);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });

    return;
  }
}
