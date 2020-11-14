import { v4 as uuidv4 } from 'uuid';
import { Venue } from "../../src/venues/models/venue.model";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker')

function generateVenue(VenueModel: typeof Venue): Venue {
  return new VenueModel({
    id: uuidv4(),
    name: faker.company.companyName(),
    slug: faker.lorem.slug(),
    address: faker.address.streetAddress(),
    g_map_link: faker.internet.url()
  })
}

export default generateVenue
