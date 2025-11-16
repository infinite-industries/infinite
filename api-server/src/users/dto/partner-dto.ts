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
    description: 'URL to the partner logo',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  logo_url: string | null;

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
    logo_url: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = partner.id;
    this.name = partner.name;
    this.logo_url = partner.logo_url;
    this.createdAt = partner.createdAt;
    this.updatedAt = partner.updatedAt;
  }
}
