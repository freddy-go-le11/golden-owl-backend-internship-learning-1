import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Auth, google } from 'googleapis';

import { CustomizeJwtService } from './../jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { getDefaultPwd } from 'src/common/functions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: CustomizeJwtService,
    private readonly configService: ConfigService,
  ) {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new google.auth.OAuth2(clientId, clientSecret);
  }

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

  async loginGoogle(googleToken: string) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(googleToken);
      const userInfoFromGoogle = google.oauth2('v2').userinfo;
      this.oauthClient.setCredentials({
        access_token: googleToken,
      });
      const userInfoResponse = await userInfoFromGoogle.get({
        auth: this.oauthClient,
      });

      const userInfoRes = userInfoResponse.data;
      const email = userInfoRes.email ?? tokenInfo.email;
      const name = userInfoRes.name ?? tokenInfo.email;
      if (!email)
        throw new UnauthorizedException("Error in getting user's email");

      let user = await this.usersService.findOne({ email });
      if (!user) {
        user = await this.usersService.create({
          email,
          name,
          password: getDefaultPwd(),
        });
      }
      return this.encodingPayloadToToken(user);
    } catch (error: any) {
      throw new UnauthorizedException(error?.message ?? 'Invalid google token');
    }
  }
}
