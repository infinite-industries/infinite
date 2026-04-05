import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import UsersService from '../users/users.service';
import { PartnersService } from '../users/partners.service';
import { VenuesService } from '../venues/venues.service';
import { PartnerModel } from '../users/models/partner.model';
import { CreateVenueRequest } from '../venues/dto/create-update-venue-request';

@Injectable()
export class TestPartnerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly partnersService: PartnersService,
    private readonly venuesService: VenuesService,
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

    await this.ensureTestVenues(partner);
  }

  private async ensureTestVenues(partner: PartnerModel): Promise<void> {
    const venues = await this.venuesService.findAll();
    const existingNames = new Set(venues.map((v) => v.name));

    if (!existingNames.has('Planet Express')) {
      this.logger.log('Creating Planet Express venue...');
      const planetExpress = await this.venuesService.create(
        new CreateVenueRequest({
          name: 'Planet Express',
          address: '123 Delivery Lane, New New York, NY 10199',
          street: '123 Delivery Lane',
          city: 'New New York',
          state: 'NY',
          zip: '10199',
          neighborhood: 'Downtown',
        }),
      );
      this.logger.log(
        `Planet Express venue created with ID: ${planetExpress.id}`,
      );

      try {
        await this.venuesService.associateVenueWithPartner({
          venue_id: planetExpress.id,
          partner_id: partner.id,
        });
        this.logger.log(
          'Successfully associated Planet Express with random-displacement-shipping',
        );
      } catch (error) {
        if (error.message?.includes('already associated')) {
          this.logger.log(
            'Planet Express is already associated with random-displacement-shipping',
          );
        } else {
          throw error;
        }
      }
    } else {
      this.logger.log('Planet Express venue already exists');
    }

    if (!existingNames.has("Mom's Friendly Robot Company")) {
      this.logger.log("Creating Mom's Friendly Robot Company venue...");
      const momsCorp = await this.venuesService.create(
        new CreateVenueRequest({
          name: "Mom's Friendly Robot Company",
          address: '456 Corporate Blvd, New New York, NY 10200',
          street: '456 Corporate Blvd',
          city: 'New New York',
          state: 'NY',
          zip: '10200',
          neighborhood: 'Midtown',
        }),
      );
      this.logger.log(
        `Mom's Friendly Robot Company venue created with ID: ${momsCorp.id}`,
      );
    } else {
      this.logger.log("Mom's Friendly Robot Company venue already exists");
    }
  }
}
