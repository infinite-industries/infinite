import {
  Body,
  Controller,
  HttpException,
  Inject,
  LoggerService,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { UserCredentials } from './dto/UserCredentials';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';
import LoginResponse from './dto/LoginResponse';
import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_LOGIN_URL,
  AUTH_USE_TEST_USERS_WARNING,
  AUTH_USE_TEST_USERS,
} from '../constants';
import createJWTForTestUser from './utils/createJWTForTestUser';
import UsersService from '../users/users.service';
import { PartnersService } from '../users/partners.service';

@Controller(`${VERSION_1_URI}/authentication`)
@ApiTags('authentication')
export class AuthenticationController implements OnModuleInit {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly partnersService: PartnersService,
  ) {
    if (AUTH_USE_TEST_USERS) {
      this.logger.warn(AUTH_USE_TEST_USERS_WARNING);
    }
  }

  async onModuleInit() {
    if (AUTH_USE_TEST_USERS) {
      await this.ensureTestPartnerUser();
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'return a jwt for a user given a valid username and password',
  })
  @ApiResponse({
    status: 200,
    description: 'jwt for api access of restricted endpoints',
    type: String,
  })
  async loginUser(
    @Body() userCredentials: UserCredentials,
  ): Promise<LoginResponse> {
    this.logger.debug(
      'handling a login request for user: ' + userCredentials.username,
    );

    if (AUTH_USE_TEST_USERS) {
      this.logger.log('using local test user login strategy');

      return this.loginWithTestUser(
        userCredentials.username,
        userCredentials.password,
      );
    } else {
      this.logger.log('using auth0 login strategy');

      return this.loginWithAuth0(
        userCredentials.username,
        userCredentials.password,
      );
    }
  }

  async loginWithTestUser(
    username: string,
    password: string,
  ): Promise<LoginResponse> {
    if (password !== 'xxx') {
      throw new HttpException('invalid username or password', 403);
    }

    if (username === 'test') {
      const token = createJWTForTestUser({
        name: 'test',
        nickname: 'test',
        'https://infinite.industries.com/isInfiniteAdmin': true,
        picture: 'https://via.placeholder.com/150',
        sub: 'test',
      });

      return { token };
    } else if (username === 'partner-admin') {
      const token = createJWTForTestUser({
        name: 'partner-admin',
        nickname: 'partner-admin',
        picture: 'https://via.placeholder.com/150',
        sub: 'partner-admin',
        'https://infinite.industries.com/isInfiniteAdmin': false,
      });

      return { token };
    } else {
      throw new HttpException('invalid username or password', 403);
    }
  }

  async loginWithAuth0(
    username: string,
    password: string,
  ): Promise<LoginResponse> {
    try {
      const results = await axios.post(AUTH0_LOGIN_URL, {
        grant_type: 'password',
        scope: 'openid profile',
        username: username,
        password: password,
        audience: AUTH0_AUDIENCE,
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
      });

      return { token: results.data.id_token };
    } catch (ex) {
      this.logger.error('error authenticating with auth0: ' + ex);
      this.logger.error('error data: ' + JSON.stringify(ex.data, null, 4));

      if (isNotNullOrUndefined(ex.data) && ex.data.error === 'invalid_grant') {
        throw new HttpException('invalid username or password', 403);
      }

      throw new HttpException(
        'there was an unknown problem performing login',
        500,
      );
    }
  }

  private async ensureTestPartnerUser() {
    this.logger.log('Ensuring partner-admin user exists...');

    // Ensure the user exists
    const testPartnerUser = await this.usersService.ensureByName({
      name: 'partner-admin',
      nickname: 'partner-admin',
      picture: 'https://via.placeholder.com/150',
    });

    this.logger.log(`Test partner user ensured with ID: ${testPartnerUser.id}`);

    // Ensure the partner exists
    let partner = await this.partnersService.findByName(
      'random-displacement-shipping',
    );

    if (!partner) {
      this.logger.log('Creating random-displacement-shipping partner...');
      partner = await this.partnersService.create({
        name: 'random-displacement-shipping',
        logo_url: '/images/partners/random-displacement-shipping.png',
      });
      this.logger.log(`Partner created with ID: ${partner.id}`);
    } else {
      this.logger.log(
        `Partner random-displacement-shipping already exists with ID: ${partner.id}`,
      );
    }

    // Associate the user with the partner (if not already associated)
    try {
      await this.partnersService.associateUserWithPartner({
        user_id: testPartnerUser.id,
        partner_id: partner.id,
      });
      this.logger.log(
        'Successfully associated partner-admin user with partner',
      );
    } catch (error) {
      if (error.message?.includes('already associated')) {
        this.logger.log('User is already associated with partner');
      } else {
        throw error;
      }
    }
  }
}
