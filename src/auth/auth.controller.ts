import { AuthService } from './auth.service';
import { Body, Controller, Post, UseFilters, Res } from '@nestjs/common';
import { UserExceptionFilter } from 'src/users/users.exception';
import { Response } from 'express';
import { UserLoginDTO, UserRegisterDTO } from './dto';

@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

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

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });

    return;
  }
}
