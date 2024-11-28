import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface ISuccessResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

interface ISuccessResponseParams<T> {
  data: T;
  metadata?: Record<string, unknown>;
}

function respond<T>(data: T | ISuccessResponseParams<T>): ISuccessResponse<T> {
  if (
    !!data &&
    typeof data == 'object' &&
    Object.prototype.hasOwnProperty.call(data as unknown as object, 'metadata')
  ) {
    const { metadata, data: datum } = data as ISuccessResponseParams<T>;
    return {
      data: datum,
      message: 'Successful',
      statusCode: 200,
      ...metadata,
    };
  }

  return {
    message: 'Successful',
    data: data as T,
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
