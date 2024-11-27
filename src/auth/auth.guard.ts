import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly mustAuthenticated: boolean) {}

  // TODO: Implement the canActivate method
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    return this.mustAuthenticated
      ? req.cookies['accessToken'] === undefined
      : req.cookies['accessToken'] !== undefined;
  }
}
