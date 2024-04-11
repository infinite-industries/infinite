import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

const EXAMPLE_DATE = new Date();

export default class ExistingEventDetectionParameters {
  @ApiProperty({
    required: true,
    example: [
      {
        venueId: 'dfef2ffe-0eed-4049-af94-cabf46852417',
        startTime: EXAMPLE_DATE,
      },
    ],
  })
  @IsNotEmpty()
  timeAndLocations: TimeAndLocationSearchParameters[];

  @ApiProperty({
    required: false,
    example: ['dfef2ffe-0eed-4049-af94-cabf46852417'],
    description:
      'used to exclude some issues from matching, for example the issue currently presented to the user',
  })
  @IsOptional()
  excludeIds?: string[];
}

export class TimeAndLocationSearchParameters {
  @ApiProperty({
    example: 'dfef2ffe-0eed-4049-af94-cabf46852417',
    required: true,
  })
  @IsNotEmpty()
  venueId: string;

  @ApiProperty({ example: EXAMPLE_DATE, required: true })
  @IsNotEmpty()
  startTime: Date;
}
