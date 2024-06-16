import {
  HttpException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { Nullable } from '../utils/NullableOrUndefinable';
import { GPSCoordinates } from './dto/GetGPSCoordinatesRequest';
import { isNullOrUndefined } from '../utils';
import NodeGeocoder from 'node-geocoder';
import { MAP_BOX_API_KEY } from '../constants';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class GpsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  async getCoordinatesFromAddress({
    street,
    city,
    state,
    zip,
  }: AddressIdentifier): Promise<Nullable<GPSCoordinates>> {
    if (isNullOrUndefined(MAP_BOX_API_KEY)) {
      this.logger.warn(
        'attention developer, did you forget to set MAP_BOX_API_KEY',
      );
      throw new HttpException(
        'The server does not have an API token set for gps access',
        500,
      );
    }

    const geocoder = NodeGeocoder({
      provider: 'mapbox',
      apiKey: MAP_BOX_API_KEY,
    });

    const matches = await geocoder.geocode(
      `${street} ${city}, ${state} ${zip}`,
    );

    if (matches.length === 0) {
      return null;
    }

    const match = matches[0];

    return {
      latitude: match.latitude,
      longitude: match.longitude,
    };
  }
}

type AddressIdentifier = {
  city: string;
  state: string;
  zip: string;
  street: string;
};
