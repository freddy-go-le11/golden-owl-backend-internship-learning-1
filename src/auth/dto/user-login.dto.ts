import { IsString, MinLength } from 'class-validator';

export class UserLoginDTO {
  @IsString()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}
