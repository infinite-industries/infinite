import { ApiProperty } from '@nestjs/swagger';

export class PartnerDTO {
  @ApiProperty({
    description: 'Unique identifier for the partner',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the partner',
    example: 'TechCorp Inc.',
  })
  name: string;

  @ApiProperty({
    description: 'URL to the partner logo for light backgrounds',
    example: 'https://example.com/logo-light.png',
    nullable: true,
  })
  light_logo_url: string | null;

  @ApiProperty({
    description: 'URL to the partner logo for dark backgrounds',
    example: 'https://example.com/logo-dark.png',
    nullable: true,
  })
  dark_logo_url: string | null;

  @ApiProperty({
    description: 'Timestamp when the partner was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the partner was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  constructor(partner: {
    id: string;
    name: string;
    light_logo_url: string | null;
    dark_logo_url: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = partner.id;
    this.name = partner.name;
    this.light_logo_url = partner.light_logo_url;
    this.dark_logo_url = partner.dark_logo_url;
    this.createdAt = partner.createdAt;
    this.updatedAt = partner.updatedAt;
  }
}
