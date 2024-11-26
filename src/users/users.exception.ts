import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { ENUM_POSTGRES_ERROR_CODE } from 'src/common/enum';
import { QueryFailedError } from 'typeorm';
import { StatusCodes } from 'http-status-codes';

@Catch(QueryFailedError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const code = (exception.driverError as any).code;
    const message = exception.message;

    if (code === ENUM_POSTGRES_ERROR_CODE.UniqueViolation) {
      response.status(StatusCodes.CONFLICT).json({
        statusCode: StatusCodes.CONFLICT,
        message: 'User already exists',
      });
    } else {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message });
    }
  }
}
