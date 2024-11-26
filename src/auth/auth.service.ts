import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CustomizeJwtService } from './../jwt/jwt.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: CustomizeJwtService,
  ) {}

  register(userRegisterDTO: UserCreateDTO) {
    return this.usersService.create(userRegisterDTO);
  }

  async login(userLoginDTO: UserLoginDTO) {
    const user = await this.usersService.findOne({ email: userLoginDTO.email });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordMatch = await compare(userLoginDTO.password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.getAccessToken(payload);
    const refreshToken = this.jwtService.getRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
