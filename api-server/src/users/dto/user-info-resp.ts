import { ApiProperty } from '@nestjs/swagger';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import cloneAttributes from '../../utils/clone-attributes';
import { v4 as uuidv4 } from 'uuid';
import { PartnerDTO } from './partner-dto';

const SAMPLE_GUID_1 = uuidv4();
const SAMPLE_GUID_2 = uuidv4();

export class UserInfoResp {
  @ApiProperty({ example: SAMPLE_GUID_1 })
  id: string;

  @ApiProperty({ example: 'Семён Лямкин' })
  name: string;

  @ApiProperty({ example: 'TylerDurden' })
  nickname: string;

  @ApiProperty({ example: true })
  isInfiniteAdmin: boolean;

  @ApiProperty({ example: false })
  isPartnerAdmin: boolean;

  @ApiProperty({ example: [SAMPLE_GUID_2] })
  venueIDs?: string[];

  @ApiProperty({
    description: 'Partners associated with the user',
    type: [PartnerDTO],
    example: [
      {
        id: SAMPLE_GUID_2,
        name: 'TechCorp Inc.',
        logo_url: 'https://example.com/logo.png',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
    ],
  })
  partners?: PartnerDTO[];

  constructor(copy?: UserInfoResp) {
    if (isNotNullOrUndefined(copy)) {
      cloneAttributes<UserInfoResp>(copy, this);
    }
  }
}
