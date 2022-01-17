import {Body, Controller, HttpException, Inject, LoggerService, Post } from '@nestjs/common';
import {VERSION_1_URI} from '../utils/versionts';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import axios from "axios";
import {UserCredentials} from "./dto/UserCredentials";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
const AUTH0_CLIENT_DOMAIN  = process.env.AUTH0_CLIENT_DOMAIN
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE
const AUTH0_LOGIN_URL = `https://${AUTH0_CLIENT_DOMAIN}/oauth/token`
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

@Controller(`${VERSION_1_URI}/authentication`)
@ApiTags('authentication')
export class AuthenticationController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {}

    @Post('login')
    @ApiOperation({ summary: 'return a jwt for a user given a valid username and passowrd' })
    @ApiResponse({
        status: 200,
        description: 'jwt for api access of restricted endpoints',
        type: String
    })
    async loginUser(@Body() userCredentials: UserCredentials): Promise<string> {
        try {
            const results = await axios.post(AUTH0_LOGIN_URL, {
                grant_type: 'password',
                scope: 'openid profile',
                username:  userCredentials.username,
                password: userCredentials.password,
                audience: AUTH0_AUDIENCE,
                client_id: AUTH0_CLIENT_ID,
                client_secret: AUTH0_CLIENT_SECRET
            })

            return results.data.id_token
        } catch(ex) {
            this.logger.error('error authenticating with auth0: ' + ex)
            throw new HttpException(ex.message, ex.status)
        }
    }
}
