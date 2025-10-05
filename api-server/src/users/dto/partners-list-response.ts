import { ResponseWrapper } from '../../dto/response-wrapper';
import cloneAttributes from '../../utils/clone-attributes';
import { PartnerDTO } from './partner-dto';

export class PartnersListResponse extends ResponseWrapper {
  partners: PartnerDTO[];

  constructor(partners: PartnerDTO[]) {
    super();

    cloneAttributes<PartnersListResponse>(
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
