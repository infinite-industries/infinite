import { ResponseWrapper } from '../../dto/response-wrapper';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import cloneAttributes from '../../utils/clone-attributes';
import { VenueDTO } from './venue-dto';

export class VenuesResponse extends ResponseWrapper {
  venues: VenueDTO[];

  constructor(copy?: Partial<VenuesResponse>) {
    super();

    if (isNotNullOrUndefined(copy)) {
      cloneAttributes<VenuesResponse>(copy, this);
    }
  }
}
