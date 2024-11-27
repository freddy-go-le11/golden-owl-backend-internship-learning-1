import { AuthService } from './auth.service';
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { UserCreateDTO } from 'src/users/dto';
import { UserExceptionFilter } from 'src/users/users.exception';

@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegisterDTO: UserCreateDTO) {
    await this.authService.register(userRegisterDTO);
    return;
  }
}
