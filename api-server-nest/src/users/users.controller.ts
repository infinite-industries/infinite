import {Controller, Get, UseGuards, UseInterceptors} from "@nestjs/common";
import {VERSION_1_URI} from "../utils/versionts";
import {LoggingInterceptor} from "../logging/logging.interceptor";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../authentication/auth.guard";
import {User} from "./dto/user";

@Controller(`${VERSION_1_URI}/users`)
@UseInterceptors(LoggingInterceptor)
@ApiTags('users')
export class UsersController {

    @Get('current')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Return information about the authenticated user'})
    @ApiResponse({
        status: 200,
        description: 'current user',
        type: User
    })
    getCurrentUser(): User {
        return {}
    }
}
