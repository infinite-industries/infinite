import { ResponseWrapper } from '../../dto/response-wrapper';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import cloneAttributes from '../../utils/clone-attributes';
import { AnnouncementModel } from '../models/announcement.model';

export class AnnouncementResponse extends ResponseWrapper {
  announcements: AnnouncementModel[];

  constructor(copy?: Partial<AnnouncementResponse>) {
    super();

    if (isNotNullOrUndefined(copy)) {
      cloneAttributes<AnnouncementResponse>(copy, this);
    }
  }
}
