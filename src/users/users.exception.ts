import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { ENUM_POSTGRES_ERROR_CODE } from 'src/common/enum';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const code = (exception.driverError as any).code;
    const message = exception.message;

    if (code === ENUM_POSTGRES_ERROR_CODE.UniqueViolation) {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'User already exists',
      });
    } else {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message });
    }
  }
}
