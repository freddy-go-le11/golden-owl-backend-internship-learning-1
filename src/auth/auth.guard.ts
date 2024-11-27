import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { TAuthRequest } from 'src/types/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly mustAuthenticated: boolean) {}

  // TODO: Implement the canActivate method
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as TAuthRequest;

    return this.mustAuthenticated ? !!req.auth?.id : !req.auth?.id;
  }
}
