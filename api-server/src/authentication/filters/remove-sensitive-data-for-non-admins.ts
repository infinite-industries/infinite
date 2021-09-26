import {Request} from "express";
import {CurrentEvent} from "../../current-events/models/current-event.model";
import {Event} from '../../events/models/event.model'
import isAdminUser from "../is-admin-user";
import {VenueModel} from "../../venues/models/venue.model";

type GenericEvent = Event | CurrentEvent
type GenericEventList = Event[] | CurrentEvent[]

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
        // @ts-ignore
        return (currentEvents as CurrentEvent[]).map(removeSensitiveDataForSingleEvent);
    } else {
        // @ts-ignore
        return (currentEvents as Event[]).map(removeSensitiveDataForSingleEvent);
    }
}

function removeSensitiveDataForSingleEvent(infiniteEvent: GenericEvent): GenericEvent {
    if (infiniteEvent instanceof CurrentEvent) {
        const strippedEvent = CurrentEvent.build(infiniteEvent.toJSON(), { include: [VenueModel] })
        strippedEvent.setDataValue('organizer_contact', undefined)

        return strippedEvent
    } else {
        const strippedEvent = Event.build(infiniteEvent.toJSON(), { include: [VenueModel] })
        strippedEvent.setDataValue('organizer_contact', undefined)

        return strippedEvent
    }
}
