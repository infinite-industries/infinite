import { ResponseWrapper } from '../../dto/response-wrapper';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import cloneAttributes from '../../utils/clone-attributes';

export class UploadsResponse extends ResponseWrapper {
  imagePath: string;

  constructor(copy?: Partial<UploadsResponse>) {
    super();

    if (isNotNullOrUndefined(copy)) {
      cloneAttributes<UploadsResponse>(copy, this);
    }
  }
}
