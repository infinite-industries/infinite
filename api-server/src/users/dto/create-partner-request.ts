import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartnerRequest {
  @ApiProperty({
    description: 'Name of the partner',
    example: 'TechCorp Inc.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'URL to the partner logo for light backgrounds',
    example: 'https://example.com/logo-light.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  light_logo_url?: string;

  @ApiProperty({
    description: 'URL to the partner logo for dark backgrounds',
    example: 'https://example.com/logo-dark.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  dark_logo_url?: string;
}
