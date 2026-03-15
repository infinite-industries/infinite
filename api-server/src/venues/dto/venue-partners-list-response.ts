import { ResponseWrapper } from '../../dto/response-wrapper';
import cloneAttributes from '../../utils/clone-attributes';
import { PartnerDTO } from '../../users/dto/partner-dto';

export class VenuePartnersListResponse extends ResponseWrapper {
  partners: PartnerDTO[];

  constructor(partners: PartnerDTO[]) {
    super();

    cloneAttributes<VenuePartnersListResponse>(
      {
        partners,
        paginated: false,
        nextPage: null,
        page: 0,
        pageSize: partners.length,
      },
      this,
    );
  }
}
