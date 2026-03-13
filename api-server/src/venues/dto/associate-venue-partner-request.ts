import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssociateVenuePartnerRequest {
  @ApiProperty({
    description: 'UUID of the venue to associate with the partner',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  venue_id: string;

  @ApiProperty({
    description: 'UUID of the partner to associate with the venue',
    example: '987fcdeb-51a2-43d1-b456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  partner_id: string;
}
