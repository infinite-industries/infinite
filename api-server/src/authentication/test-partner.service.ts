import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import UsersService from '../users/users.service';
import { PartnersService } from '../users/partners.service';

@Injectable()
export class TestPartnerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly partnersService: PartnersService,
  ) {}

  async ensureTestPartnerUser(): Promise<void> {
    this.logger.log('Ensuring partner-admin user exists...');

    const testPartnerUser = await this.usersService.ensureByName({
      name: 'partner-admin',
      nickname: 'partner-admin',
      picture: 'https://via.placeholder.com/150',
    });

    this.logger.log(`Test partner user ensured with ID: ${testPartnerUser.id}`);

    let partner = await this.partnersService.findByName(
      'random-displacement-shipping',
    );

    if (!partner) {
      this.logger.log('Creating random-displacement-shipping partner...');
      partner = await this.partnersService.create({
        name: 'random-displacement-shipping',
        light_logo_url: '/images/partners/random-displacement-shipping.png',
        dark_logo_url: '/images/partners/random-displacement-shipping.png',
      });
      this.logger.log(`Partner created with ID: ${partner.id}`);
    } else {
      this.logger.log(
        `Partner random-displacement-shipping already exists with ID: ${partner.id}`,
      );
    }

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
