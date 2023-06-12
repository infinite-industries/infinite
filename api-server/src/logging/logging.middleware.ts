import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export default class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  use(request: Request, response: Response, next: NextFunction): void {
    const requestStartTime = Date.now();

    response.on('finish', () => {
      const url = request.url;
      const statusCode = response.statusCode;
      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;

      this.logger.log(`${url} ${statusCode} (${requestDuration} ms)`);
    });

    next();
  }
}
