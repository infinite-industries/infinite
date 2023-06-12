import { ResponseWrapper } from '../../dto/response-wrapper';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import { VenueModel } from '../models/venue.model';

export class SingleVenueResponse extends ResponseWrapper {
  venue: VenueModel;

  constructor(copy?: Partial<SingleVenueResponse>) {
    super(copy);

    if (isNotNullOrUndefined(copy)) {
      this.venue = copy.venue;
    }
  }
}
