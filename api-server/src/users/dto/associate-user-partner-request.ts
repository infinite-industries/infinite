import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssociateUserPartnerRequest {
  @ApiProperty({
    description: 'UUID of the user to associate with the partner',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'UUID of the partner to associate with the user',
    example: '987fcdeb-51a2-43d1-b456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  partner_id: string;
}
