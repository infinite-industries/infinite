import faker from 'faker'
import { Venue } from "../venues/models/venue.model";

function generateVenue(): Venue {
  return new Venue({
    name: faker.company.companyName(),
    slug: faker.lorem.slug(),
    address: faker.address.streetAddress(),
    g_map_link: faker.internet.url()
  })
}

export default generateVenue
