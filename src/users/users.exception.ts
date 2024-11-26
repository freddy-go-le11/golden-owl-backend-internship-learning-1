import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common';

import { ENUM_POSTGRES_ERROR_CODE } from 'src/common/enum'; // Adjust this import based on your project
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UserAlreadyException implements ExceptionFilter {
  catch(exception: QueryFailedError) {
    if (
      (exception.driverError as any).code ===
      ENUM_POSTGRES_ERROR_CODE.UniqueViolation
    ) {
      throw new ConflictException('Email already exists');
    }

    throw exception;
  }
}
