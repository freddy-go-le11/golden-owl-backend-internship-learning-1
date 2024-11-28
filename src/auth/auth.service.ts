import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CustomizeJwtService } from './../jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { getUserInfoViaGoogleAccessToken } from 'src/common/functions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: CustomizeJwtService,
  ) {}

  register(userRegisterDTO: UserRegisterDTO) {
    return this.usersService.create(userRegisterDTO);
  }

  encodingPayloadToToken(user: User) {
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.getAccessToken(payload);
    const refreshToken = this.jwtService.getRefreshToken(payload);

    return { session: payload, accessToken, refreshToken };
  }

  async login(userLoginDTO: UserLoginDTO) {
    const user = await this.usersService.findOne({ email: userLoginDTO.email });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordMatch = await compare(userLoginDTO.password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    return this.encodingPayloadToToken(user);
  }

  async loginOrCreateUserViaGoogle(googleAccessToken: string) {
    const { name, email } =
      await getUserInfoViaGoogleAccessToken(googleAccessToken);
    let user = await this.usersService.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).substring(7);
      user = await this.usersService.create({
        email,
        name,
        password: randomPassword,
      });
    }

    return this.encodingPayloadToToken(user);
  }
}
