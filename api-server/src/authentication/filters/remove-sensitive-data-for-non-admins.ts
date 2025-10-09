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

export function removeSensitiveDataForSingleEvent<
  T extends EventDTO | EventModel,
>(request: RequestWithUserInfo, infiniteEvent: T): T {
  if (isOwner(infiniteEvent, request)) {
    // they own it, just return the unfiltered event
    return infiniteEvent;
  }

  if (isEventModel(infiniteEvent)) {
    return removeSensitiveDataForSingleEventModel(request, infiniteEvent) as T;
  } else {
    // Process EventDTO - strip the organizer_contact, we keep this internal and don't expose
    // it over the api or via the ui to un-authenticated users
    return {
      ...infiniteEvent,
      organizer_contact: undefined,
      event_admin_metadata: undefined,
    };
  }
}

function removeSensitiveDataForSingleEventModel(
  request: RequestWithUserInfo,
  infiniteEvent: EventModel,
): EventModel {
  if (isOwner(infiniteEvent, request)) {
    return infiniteEvent;
  }

  // ideally I'd clone this like we do for the DTO, but cloing Sequealize modesl is weird
  // you can do something like new EventModel(oldModel.get({ plain: true }))
  // but that drops all the nested models like venues and partners
  infiniteEvent.organizer_contact = undefined;
  infiniteEvent.event_admin_metadata = undefined;

  return infiniteEvent;
}

export function isOwner(
  event: EventDTO | EventModel,
  request: RequestWithUserInfo,
) {
  if (request.userInformation?.isInfiniteAdmin) {
    // infinite admins own all events
    return true;
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

function isEventModel(obj: any): obj is EventModel {
  return obj instanceof EventModel;
}
