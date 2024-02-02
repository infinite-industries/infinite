export type ExistingEventDetectionResultsConstructor = {
  isLikelyExisting: boolean;
  confidence: number;
  factors: {
    percentMatchingStartTimesAtSameVenue: number;
  };
};

export default class ExistingEventDetectionResults {
  isLikelyExisting: boolean;
  confidence: number;
  factors: {
    percentMatchingStartTimesAtSameVenue: number;
  };

  constructor(args: ExistingEventDetectionResultsConstructor) {
    this.isLikelyExisting = args.isLikelyExisting;
    this.confidence = args.confidence;
    this.factors = args.factors;
  }
}
