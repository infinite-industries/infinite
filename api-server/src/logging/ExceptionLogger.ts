import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionLogger extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const message = exception?.response?.message || 'unknown reason';
    const url = Array.isArray(host.getArgs())
      ? host.getArgs()[0]?.url || 'unknown url'
      : 'unknown url';
    const method = Array.isArray(host.getArgs())
      ? host.getArgs()[0]?.method || 'unknown method'
      : 'unknown method';

    console.info(`Handled Exception (${url}, ${method}): "${message}"`);
    super.catch(exception, host);
  }
}
