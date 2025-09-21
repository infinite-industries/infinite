import { CreatePartnerRequest } from '../../src/users/dto/create-partner-request';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');

function generatePartnerRequest(): CreatePartnerRequest {
  return {
    name: faker.company.companyName(),
    logo_url: faker.internet.url() + '/logo.png',
  };
}

export default generatePartnerRequest;
