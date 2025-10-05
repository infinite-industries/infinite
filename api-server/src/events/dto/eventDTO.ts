import { ApiProperty } from '@nestjs/swagger';
import { VenueModel } from '../../venues/models/venue.model';
import { StartEndTimePairs } from '../../shared-types/start-end-time-pairs';

const EXAMPLE_DATE = new Date();
const EXAMPLE_START_DATE = new Date(
  new Date().setDate(new Date().getHours() + 1),
);
const EXAMPLE_END_DATE = new Date(
  new Date().setDate(new Date().getHours() + 2),
);

export default class EventDTO {
  @ApiProperty({ example: '166ab8f0-a067-11ea-aa51-cdc3fe7afefa' })
  id: string;

  @ApiProperty({ example: 'f467e7a0-a066-11ea-aa51-cdc3fe7afefa' })
  venue_id: string;

  @ApiProperty({ example: 'Infinite Gallery Opening' })
  title: string;

  @ApiProperty({ example: 'infinite-gallery-opening' })
  slug: string;

  @ApiProperty({ example: 'f467e7a0-a066-11ea-aa51-cdc3fe7afefa' })
  image: string;

  @ApiProperty({
    example:
      'https://s3-us-west-2.amazonaws.com/infinite-industries-event-images/uploads/a4da445e-a656-461c-8bcf-4ea8af626e81.jpg',
  })
  social_image: string;

  @ApiProperty({ example: '5' })
  admission_fee: string;

  @ApiProperty({ example: 'bob.vance@refridgeration.com' })
  organizer_contact: string;

  @ApiProperty({ example: 'The gallery is open' })
  brief_description: string;

  @ApiProperty({ example: '<h2>The Gallery Is Open</h2><p>Some details</p>' })
  description: string;

  @ApiProperty({ example: 'https://www.wegotrats.com' })
  website_link: string;

  @ApiProperty({ example: 'https://www.wegotussometickets.com' })
  ticket_link: string;

  @ApiProperty({ example: 'https://thebookwhoshallnotbenames.com/foobar' })
  fb_event_link: string;

  @ApiProperty({ example: 'https://eventbrite.com/foobar' })
  eventbrite_link: string;

  @ApiProperty({ example: 'https://bitly.com/foobar' })
  bitly_link: string;

  @ApiProperty({ example: true })
  verified: boolean;

  @ApiProperty({ example: EXAMPLE_DATE })
  createdAt: Date;

  @ApiProperty({ example: false })
  multi_day: boolean;

  @ApiProperty({ example: EXAMPLE_DATE })
  updatedAt: Date;

  @ApiProperty({ example: 'radio-mc-radio-station' })
  reviewed_by_org: string;

  @ApiProperty({
    example: [{ start_time: EXAMPLE_START_DATE, end_time: EXAMPLE_END_DATE }],
  })
  date_times: StartEndTimePairs[];

  @ApiProperty({ example: ['music', 'dance'] })
  tags: Array<string>;

  @ApiProperty({ example: 'multi-day-event' })
  category: string;

  @ApiProperty({ example: ['postponed', 'sold-out'] })
  condition: Array<string>;

  @ApiProperty({ example: 'in-person' })
  mode: string;

  @ApiProperty({ example: [] })
  links: Array<string>;

  @ApiProperty()
  venue: VenueModel;

  @ApiProperty({
    example: {
      is_problem: false,
      createdAt: EXAMPLE_DATE,
      updatedAt: EXAMPLE_DATE,
    },
    required: false,
  })
  event_admin_metadata?: {
    is_problem: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
