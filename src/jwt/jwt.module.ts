import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [],
})
export class CustomizeJwtModule {}
