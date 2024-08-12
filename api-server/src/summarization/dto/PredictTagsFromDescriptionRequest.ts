import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PredictTagsFromDescriptionRequest {
  @ApiProperty({ example: 'Infinite Gallery Opening' })
  @IsNotEmpty()
  description: string;
}
