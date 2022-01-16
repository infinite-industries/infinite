import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {VERSION_1_URI} from '../utils/versionts';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import axios from "axios";
import {Request} from "express";

// '!!!
const secret = '***'

const AUTHO_CLIENT_ID = process.env.AUTH0_CLIENT_ID
const AUTH0_CLIENT_DOMAIN  = process.env.AUTH0_CLIENT_DOMAIN
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE
const AUTHO_LOGIN_URL = 'https://1nfinite.auth0.com/oauth/token'

class LoginResponse {
    status: 'success' | 'fail'
    errorMessage?: string
    jwt?: string
}

class UserCredentials {
    username: string
    password: string
}

@Controller(`${VERSION_1_URI}/authentication`)
@ApiTags('authentication')
export class AuthenticationController {

    @Post('login')
    @ApiOperation({ summary: 'return a jwt for a user given a valid username and passowrd' })
    @ApiResponse({
        status: 200,
        description: 'jwt for api access of restricted endpoints',
        type: LoginResponse
    })
    async loginUser(@Body() userCredentials: UserCredentials): Promise<LoginResponse> {


        try {
            const results = await axios.post(AUTHO_LOGIN_URL, {
                grant_type: 'password',
                username:  'test-admin@infinite.industries',
                password: '***',
                audience: "https://1nfinite.auth0.com/api/v2/",
                scope: 'openid profile',
                client_id: 'PYKhof4U0jKE3v4h8xKSgihHz9atBE5O',
                client_secret: secret
            })

            console.log('!!! much results')
            console.log(results)
        } catch(ex) {
            console.log('!!! request failed')
            console.log(ex)
            console.log(ex.message)
        }


        return  {
            status: 'success',
            jwt: 'abcd'
        }
    }

    @Get('callback')
    @ApiOperation({ summary: 'a callback used to recieve OAuth results'})
    @ApiResponse({
        status: 200,
        description: 'tbd',
        type: String
    })
    async callback(@Req() request: Request) {
        console.log('!!! in callback')
        console.log(request)

        return '!!! foo'
    }
}
