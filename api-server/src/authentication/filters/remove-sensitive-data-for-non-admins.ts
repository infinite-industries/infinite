import { Request } from 'express';
import isAdminUser from '../is-admin-user';
import EventDTO from '../../events/dto/eventDTO';

type EventOrEventList = EventDTO | EventDTO[];

export async function removeSensitiveDataForNonAdmins<
  T extends EventOrEventList,
>(request: Request, events: T): Promise<T> {
  const isAdmin = await isAdminUser(request);

  if (isAdmin) {
    return events;
  }

  if (isGenericEventList(events)) {
    return removeSensitiveDataList(events) as T;
  } else {
    return removeSensitiveDataForSingleEvent(events as EventDTO) as T;
  }
}

function removeSensitiveDataList(currentEvents: EventDTO[]): EventDTO[] {
  if (currentEvents.length === 0) {
    return [];
  } else {
    return currentEvents.map(removeSensitiveDataForSingleEvent);
  }
}

function removeSensitiveDataForSingleEvent(infiniteEvent: EventDTO): EventDTO {
  return { ...infiniteEvent, organizer_contact: undefined };
}

function isGenericEventList(arg: EventOrEventList): arg is EventDTO[] {
  return Array.isArray(arg);
}
