import {Request} from "express";
import {CurrentEvent} from "../../current-events/models/current-event.model";
import {Event} from '../../events/models/event.model'
import isAdminUser from "../is-admin-user";
import {Model} from "sequelize-typescript";

type GenericEvent = Event | CurrentEvent
type GenericEventList = Event[] | CurrentEvent[]

export default async function removeSensitiveDataForNonAdmins(
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
        return buildModelWithSensitiveDataRemoved<CurrentEvent>(infiniteEvent, CurrentEvent)
    } else {
        return buildModelWithSensitiveDataRemoved<Event>(infiniteEvent, Event)
    }
}

function removeSensitiveDataList(currentEvents: GenericEventList): GenericEventList {
    if (currentEvents.length === 0) {
        return []
    } else if (currentEvents[0] instanceof CurrentEvent) {
        return (currentEvents as CurrentEvent[])
            .map(e => buildModelWithSensitiveDataRemoved<CurrentEvent>(e, CurrentEvent))
    } else {
        return (currentEvents as Event[])
            .map(e => buildModelWithSensitiveDataRemoved<Event>(e, Event))
    }
}

function buildModelWithSensitiveDataRemoved<T extends Model>(event: T, t: new (any) => T): T {
    return new t({
        ...event.toJSON(),
        organizer_contact: undefined
    });
}
