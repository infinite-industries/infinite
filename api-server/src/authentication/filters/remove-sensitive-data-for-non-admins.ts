import {Request} from "express";
import {CurrentEvent} from "../../current-events/models/current-event.model";
import isAdminUser from "../is-admin-user";
import {VenueModel} from "../../venues/models/venue.model";
import EventDTO from "../../events/dto/eventDTO";

type GenericEvent = EventDTO | CurrentEvent
type GenericEventList = EventDTO[] | CurrentEvent[]

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
    } else if (currentEvents[0] instanceof CurrentEvent) {
        return (currentEvents as CurrentEvent[]).map(removeSensitiveDataForSingleEvent);
    } else {
        return (currentEvents as EventDTO[]).map(removeSensitiveDataForSingleEvent);
    }
}

function removeSensitiveDataForSingleEvent(infiniteEvent: GenericEvent): GenericEvent {
    if (infiniteEvent instanceof CurrentEvent) {
        const strippedEvent = CurrentEvent.build(infiniteEvent.toJSON(), { include: [VenueModel] })
        strippedEvent.setDataValue('organizer_contact', undefined)

        return strippedEvent
    } else {
        return {...infiniteEvent, organizer_contact: undefined }
    }
}
