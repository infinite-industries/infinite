import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class UpsertEventAdminMetadataRequest {
  @ApiProperty({ example: 'true' })
  @IsNotEmpty()
  isProblem: boolean;
}
