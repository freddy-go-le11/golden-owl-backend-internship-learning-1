import { ValidateIf, IsEmail, IsNumber } from 'class-validator';

export class UserFindOneDto {
  @ValidateIf((o) => o.email === undefined)
  @IsNumber()
  id: number;

  @ValidateIf((o) => o.id === undefined)
  @IsEmail()
  email: string;
}
