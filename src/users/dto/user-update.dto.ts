import { PartialType } from '@nestjs/mapped-types';
import { UserCreateDTO } from './user-create.dto';

export class UserUpdateDto extends PartialType(UserCreateDTO) {}
