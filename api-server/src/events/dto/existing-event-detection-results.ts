import { ApiProperty } from '@nestjs/swagger';

export default class ExistingEventDetectionResults {
  @ApiProperty({ example: 'true' })
  isLikelyExisting: boolean;

  @ApiProperty({ example: 70 })
  confidence: number;

  @ApiProperty({ example: { percentMatchingStartTimesAtSameVenue: 70 } })
  factors: ExistingEventDetectionFactors;

  @ApiProperty({
    example: [
      {
        title: 'The Main Event',
        briefDescription: 'Do not miss this',
        verified: false,
        url: 'http://my-host/events/dfef2ffe-0eed-4049-af94-cabf46852417',
      },
    ],
  })
  candidateEvents: CandidateEvent[];

  constructor(args: ExistingEventDetectionResultsConstructor) {
    this.isLikelyExisting = args.isLikelyExisting;
    this.confidence = args.confidence;
    this.factors = args.factors;
    this.candidateEvents = args.candidateEvents;
  }
}
export type ExistingEventDetectionResultsConstructor = {
  isLikelyExisting: boolean;
  confidence: number;
  factors: ExistingEventDetectionFactors;
  candidateEvents: CandidateEvent[];
};

export type CandidateEvent = {
  title: string;
  briefDescription: string;
  verified: boolean;
  url: string;
};

export type ExistingEventDetectionFactors = {
  percentMatchingStartTimesAtSameVenue: number;
};
