import { CreateOrUpdateAnnouncementRequest } from '../../src/announcements/dto/create-or-update-announcement-request';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');

function generateAnnouncementRequest(): CreateOrUpdateAnnouncementRequest {
  return {
    message: faker.lorem.paragraph(),
  };
}

export default generateAnnouncementRequest;
