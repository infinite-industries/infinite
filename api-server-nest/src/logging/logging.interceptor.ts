import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const url = context.switchToHttp().getRequest().url;
        const requestStartTime = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const requestEndTime = Date.now();
                    const requestDuration = requestEndTime - requestStartTime;

                    const res = context.switchToHttp().getResponse()

                    console.info(`${url} ${ res.statusCode } (${requestDuration} ms)`)
                })
            );
    }
}