import { ResponseWrapper } from '../../dto/response-wrapper';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import { VenueDTO } from './venue-dto';

export class SingleVenueResponse extends ResponseWrapper {
  venue: VenueDTO;

  constructor(copy?: Partial<SingleVenueResponse>) {
    super(copy);

    if (isNotNullOrUndefined(copy)) {
      this.venue = copy.venue;
    }
  }
}
