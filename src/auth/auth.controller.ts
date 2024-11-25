import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDTO } from 'src/users/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegisterDTO: UserCreateDTO) {
    await this.authService.register(userRegisterDTO);
    return;
  }
}
