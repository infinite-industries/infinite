export default class ExistingEventDetectionResults {
  isLikelyExisting: boolean;
  confidence: number;
  factors: ExistingEventDetectionFactors;
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
