import {Injectable, NestMiddleware} from "@nestjs/common";
import {Response, NextFunction} from "express";

@Injectable()
export default class  LoggingMiddleware implements NestMiddleware {

    use(request: Request, response: Response, next: NextFunction): void {
        const requestStartTime = Date.now()

        response.on('finish', () => {
            const url = request.url
            const statusCode = response.statusCode
            const requestEndTime = Date.now()
            const requestDuration = requestEndTime - requestStartTime

            console.info(`${url} ${ statusCode } (${requestDuration} ms)`)
        });

        next()
    }
}
