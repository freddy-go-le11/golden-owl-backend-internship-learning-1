import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomizeJwtService } from 'src/jwt/jwt.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, UsersService, CustomizeJwtService],
  controllers: [AuthController],
})
export class AuthModule {}
