import { AuthService } from './auth.service';
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { UserCreateDTO } from 'src/users/dto';
import { UserExceptionFilter } from 'src/users/users.exception';

@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() userRegisterDTO: UserCreateDTO) {
    return this.authService.register(userRegisterDTO);
  }
}
