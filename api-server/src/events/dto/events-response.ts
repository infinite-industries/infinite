import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import EventDTO from "./eventDTO";

export class EventsResponse extends ResponseWrapper {
    events: EventDTO []

    constructor(copy?: Partial<EventsResponse>) {
        super()

        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<EventsResponse>(copy, this)
        }
    }
}
