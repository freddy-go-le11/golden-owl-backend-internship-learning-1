import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ENUM_GENDER } from 'src/common/enum';

export class UserCreateDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsEnum(ENUM_GENDER)
  readonly gender: ENUM_GENDER;
}
