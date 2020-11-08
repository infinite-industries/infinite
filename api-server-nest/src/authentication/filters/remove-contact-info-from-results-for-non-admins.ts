import {Request} from "express";
import {CurrentEvent} from "../../current-events/dto/current-event.model";
import {Event} from '../../events/models/event.model'
import isAdminUser from "../is-admin-user";


export async function removeContactInfoFromResultsForNonAdminsFromEvents(
    request: Request,
    events: Event | Event []
): Promise<Event | Event []> {
    const isAdmin = await isAdminUser(request);

    if (isAdmin) {
        return events
    }

    if (Array.isArray(events)) {
        return removeContactInfoFromEventList(events)
    } else {
        return removeContactInfoFromEvent(events)
    }
}

export async function removeContactInfoFromResultsForNonAdminsFromCurrentEvents(
    request: Request,
    events: CurrentEvent | CurrentEvent []
): Promise<Event | Event []> {
    const isAdmin = await isAdminUser(request);

    if (isAdmin) {
        return events
    }

    if (Array.isArray(events)) {
        return removeContactInfoFormCurrentEventList(events)
    } else {
        return removeContactInfoFromCurrentEvent(events)
    }
}

function removeContactInfoFormCurrentEventList(currentEvents: CurrentEvent []): CurrentEvent[] {
    return currentEvents
        .map(removeContactInfoFromCurrentEvent);
}

function removeContactInfoFromEventList(events: Event []): Event[] {
    return events
        .map(removeContactInfoFromEvent);
}

function removeContactInfoFromEvent(event: Event): Event {
    return new Event({
        ...event.toJSON(),
        organizer_contact: undefined
    })
}

function removeContactInfoFromCurrentEvent(currentEvent: CurrentEvent): CurrentEvent {
    return new CurrentEvent({
        ...currentEvent.toJSON(),
        organizer_contact: undefined
    });
}
