import { Injectable } from '@nestjs/common';
import { UserCreateDTO } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(userRegisterDTO: UserCreateDTO) {
    await this.usersService.create(userRegisterDTO);
    return;
  }
}
