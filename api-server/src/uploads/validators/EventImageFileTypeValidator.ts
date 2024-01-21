import { FileTypeValidator } from '@nestjs/common';

const VALIDATION_EXPRESSION = /image\/.*$/i;

export default class EventImageFileTypeValidator extends FileTypeValidator {
  constructor() {
    super({ fileType: VALIDATION_EXPRESSION });
  }
  override buildErrorMessage(): string {
    return 'The file must be a valid image type (jpg, png, gif, webp, etc...).';
  }
}
