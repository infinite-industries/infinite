import { ResponseWrapper } from '../../dto/response-wrapper';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import cloneAttributes from '../../utils/clone-attributes';
import { EventAdminMetadataModel } from '../models/event-admin-metadata.model';

export class EventAdminMetadataSingleResponse extends ResponseWrapper {
  eventAdminMetadata: EventAdminMetadataModel;

  constructor(eventAdminMetadata: EventAdminMetadataModel) {
    super();

    this.eventAdminMetadata = eventAdminMetadata.toJSON();
  }
}

export class EventAdminMetadataListResponse extends ResponseWrapper {
  eventAdminMetadata: EventAdminMetadataModel[];

  constructor(copy?: Partial<EventAdminMetadataListResponse>) {
    super();

    if (isNotNullOrUndefined(copy)) {
      cloneAttributes<EventAdminMetadataListResponse>(copy, this);
    }
  }
}
