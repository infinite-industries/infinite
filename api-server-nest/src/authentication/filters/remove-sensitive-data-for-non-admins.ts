import {Request} from "express";
import {CurrentEvent} from "../../current-events/models/current-event.model";
import {Event} from '../../events/models/event.model'
import isAdminUser from "../is-admin-user";

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

function removeSensitiveDataForSingleEvent(infiniteEvent: GenericEvent): GenericEvent {
    if (infiniteEvent instanceof CurrentEvent) {
        infiniteEvent.setDataValue('organizer_contact', undefined)
        return infiniteEvent // buildModelWithSensitiveDataRemoved<CurrentEvent>(infiniteEvent, CurrentEvent)
    } else {
        infiniteEvent.setDataValue('organizer_contact', undefined)
        return infiniteEvent
    }
}

function removeSensitiveDataList(currentEvents: GenericEventList): GenericEventList {
    if (currentEvents.length === 0) {
        return []
    } else if (currentEvents[0] instanceof CurrentEvent) {
        return (currentEvents as CurrentEvent[])
            .map(e => {
                e.setAttributes('organizer_contact', undefined)
                return e
            });
    } else {
        return (currentEvents as Event[])
            .map(e => {
                e.setAttributes('organizer_contact', undefined)
                return e
            });
    }
}

// function buildModelWithSensitiveDataRemoved<T extends Model>(event: T, t: new (any) => T): T {
//     const cleanInstance = new t({
//         ...event.toJSON(),
//         organizer_contact: undefined
//     });
//
//     (cleanInstance as unknown as Event)
//         .setDataValue('venue', (event as unknown as Event).getDataValue('venue'));
//
//    return cleanInstance
// }
