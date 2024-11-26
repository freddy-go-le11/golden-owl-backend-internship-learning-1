import { Injectable } from '@nestjs/common';
import { UserCreateDTO } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  register(userRegisterDTO: UserCreateDTO) {
    return this.usersService.create(userRegisterDTO);
  }
}
