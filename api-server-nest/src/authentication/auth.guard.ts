import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {parseJwt, UserInformation} from "./parse-jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            const userInformation: UserInformation = await parseJwt(request);

            request.userInformation = userInformation

            return userInformation.isInfiniteAdmin;
        } catch (ex) {
            console.error(ex);
            throw new HttpException('invalid auth token', HttpStatus.FORBIDDEN);
        }
    }
}
