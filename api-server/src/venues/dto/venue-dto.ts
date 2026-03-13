import { ApiProperty } from '@nestjs/swagger';
import { PartnerDTO } from '../../users/dto/partner-dto';

const EXAMPLE_DATE = new Date();

export class VenueDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: "Bob Vance's Chill Bar" })
  name: string;

  @ApiProperty({ example: 'chill-bar' })
  slug: string;

  @ApiProperty({ example: '232 Paper St. Scranton, Pennsylvania' })
  address: string;

  @ApiProperty({ example: 'https://maps.google.com/maps/foo/bar' })
  g_map_link: string;

  @ApiProperty({ example: 32.7 })
  gps_lat: number;

  @ApiProperty({ example: 76.3 })
  gps_long: number;

  @ApiProperty({ example: 17.1 })
  gps_alt: number;

  @ApiProperty({ example: '232 Paper St.' })
  street: string;

  @ApiProperty({ example: 'Scranton' })
  city: string;

  @ApiProperty({ example: 'Pennsylvania' })
  state: string;

  @ApiProperty({ example: '18503' })
  zip: string;

  @ApiProperty({ example: 'Downtown' })
  neighborhood: string;

  @ApiProperty({ example: false })
  is_soft_deleted: boolean;

  @ApiProperty({ example: EXAMPLE_DATE })
  createdAt: Date;

  @ApiProperty({ example: EXAMPLE_DATE })
  updatedAt: Date;

  @ApiProperty({
    type: () => [PartnerDTO],
    required: false,
    description: 'Partners associated with this venue',
  })
  partners: PartnerDTO[];

  constructor(venue: {
    id: string;
    name: string;
    slug: string;
    address: string;
    g_map_link: string;
    gps_lat: number;
    gps_long: number;
    gps_alt: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    neighborhood: string;
    is_soft_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    partners?: PartnerDTO[];
  }) {
    this.id = venue.id;
    this.name = venue.name;
    this.slug = venue.slug;
    this.address = venue.address;
    this.g_map_link = venue.g_map_link;
    this.gps_lat = venue.gps_lat;
    this.gps_long = venue.gps_long;
    this.gps_alt = venue.gps_alt;
    this.street = venue.street;
    this.city = venue.city;
    this.state = venue.state;
    this.zip = venue.zip;
    this.neighborhood = venue.neighborhood;
    this.is_soft_deleted = venue.is_soft_deleted;
    this.createdAt = venue.createdAt;
    this.updatedAt = venue.updatedAt;
    this.partners = venue.partners ?? [];
  }
}
