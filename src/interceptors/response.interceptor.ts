import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface ISuccessResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

function respond<T>(data: T): ISuccessResponse<T> {
  return {
    message: 'Successful',
    data,
    statusCode: 200,
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ISuccessResponse<T>> {
    return next.handle().pipe(map((data) => respond(data)));
  }
}
