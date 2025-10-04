import EventDTO from '../../events/dto/eventDTO';
import { RequestWithUserInfo } from '../../users/dto/RequestWithUserInfo';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import { EventModel } from '../../events/models/event.model';

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
  if (isOwner(infiniteEvent, request)) {
    // they own it, just return the unfiltered event
    return infiniteEvent;
  }

  // strip the organizer_contact, we keep this internal and don't expose
  // it over the api or via the ui to un-authenticated users
  return { ...infiniteEvent, organizer_contact: undefined };
}

export function isOwner(
  event: EventDTO | EventModel,
  request: RequestWithUserInfo,
) {
  if (request.userInformation?.isInfiniteAdmin) {
    // infinite admins own all events
    return true; // !!! HOW DID THIS PASS WHEN I SET IT TO FALSE
  }

  if (!request.userInformation?.isPartnerAdmin) {
    // not a partner admin can't own anything
    return false;
  }

  // check if the event belongs to own of their partnerships
  return isNotNullOrUndefined(
    request.userInformation.partners.find(
      (p) => p.id === event.owning_partner_id,
    ),
  );
}

function isGenericEventList(arg: EventOrEventList): arg is EventDTO[] {
  return Array.isArray(arg);
}
