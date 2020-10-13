import { Venue } from "../venues/models/venue.model";
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker')

function generateVenue(): Venue {
  return new Venue({
    id: uuidv4(),
    name: faker.company.companyName(),
    slug: faker.lorem.slug(),
    address: faker.address.streetAddress(),
    g_map_link: faker.internet.url()
  })
}

export default generateVenue
