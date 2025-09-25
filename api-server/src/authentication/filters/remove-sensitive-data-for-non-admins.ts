import { Request } from 'express';
import isAdminUser from '../is-admin-user';
import EventDTO from '../../events/dto/eventDTO';
import { RequestWithUserInfo } from '../../users/dto/RequestWithUserInfo';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';

type EventOrEventList = EventDTO | EventDTO[];

export async function removeSensitiveDataForNonAdmins<
  T extends EventOrEventList,
>(request: RequestWithUserInfo, events: T): Promise<T> {
  const isAdmin = request.userInformation?.isInfiniteAdmin;

  if (isAdmin) {
    // no filter for infinite admins
    return events;
  }

  if (isGenericEventList(events)) {
    return removeSensitiveDataList(request, events) as T;
  } else {
    return removeSensitiveDataForSingleEvent(request, events as EventDTO) as T;
  }
}

function removeSensitiveDataList(
  request: RequestWithUserInfo,
  currentEvents: EventDTO[],
): EventDTO[] {
  if (currentEvents.length === 0) {
    return [];
  } else {
    return currentEvents.map((event) =>
      removeSensitiveDataForSingleEvent(request, event),
    );
  }
}

function removeSensitiveDataForSingleEvent(
  request: RequestWithUserInfo,
  infiniteEvent: EventDTO,
): EventDTO {
  const isPartnerAdmin = request.userInformation?.isPartnerAdmin;

  if (isPartnerAdmin) {
    // if the user is a partner admin check if this even belongs to them before
    // filtering
    console.log(
      '!!! partners: ' +
        JSON.stringify(request.userInformation.partners, null, 4),
    );

    const isOwner: boolean = isNotNullOrUndefined(
      request.userInformation.partners.find(
        (p) => p.id === infiniteEvent.owning_partner_id,
      ),
    );

    if (isOwner) {
      // they own it, just return the unfiltered event
      return infiniteEvent;
    }
  }

  // strip the organizer_contact, we keep this internal and don't expose
  // it over the api or via the ui to un-authenticated users
  return { ...infiniteEvent, organizer_contact: undefined };
}

function isGenericEventList(arg: EventOrEventList): arg is EventDTO[] {
  return Array.isArray(arg);
}
