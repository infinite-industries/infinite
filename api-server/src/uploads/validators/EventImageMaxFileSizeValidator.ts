import { MaxFileSizeValidator } from '@nestjs/common';

const TEN_MEGABYTES = 10000000;

export default class EventImageMaxFileSizeValidator extends MaxFileSizeValidator {
  constructor() {
    super({ maxSize: TEN_MEGABYTES });
  }

  override buildErrorMessage(): string {
    const maxSizeInMegabytes = () => this.validationOptions.maxSize / 1000000;
    const formattedMaxSize = () => maxSizeInMegabytes().toLocaleString();

    return `Event images must be less than ${formattedMaxSize()} megabytes.`;
  }
}
