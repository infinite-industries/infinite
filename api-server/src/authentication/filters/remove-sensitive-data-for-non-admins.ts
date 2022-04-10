import {Request} from "express";
import isAdminUser from "../is-admin-user";
import EventDTO from "../../events/dto/eventDTO";

type GenericEvent = EventDTO
type GenericEventList = EventDTO[]

export async function removeSensitiveDataForNonAdmins(
    request: Request,
    events: GenericEvent | GenericEventList
): Promise<GenericEvent | GenericEventList> {
    const isAdmin = await isAdminUser(request);

    if (isAdmin) {
        return events
    }

    if (Array.isArray(events)) {
        return removeSensitiveDataList(events)
    } else {
        return removeSensitiveDataForSingleEvent(events)
    }
}

function removeSensitiveDataList(currentEvents: GenericEventList): GenericEventList {
    if (currentEvents.length === 0) {
        return []
    } else if (currentEvents[0] instanceof EventDTO) {
        return (currentEvents as EventDTO[]).map(removeSensitiveDataForSingleEvent);
    } else {
        return (currentEvents as EventDTO[]).map(removeSensitiveDataForSingleEvent);
    }
}

function removeSensitiveDataForSingleEvent(infiniteEvent: GenericEvent): GenericEvent {
    return {...infiniteEvent, organizer_contact: undefined }
}
