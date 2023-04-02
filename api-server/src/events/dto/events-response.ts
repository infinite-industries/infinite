import {ResponseWrapper} from "../../dto/response-wrapper";
import cloneAttributes from "../../utils/clone-attributes";
import EventDTO from "./eventDTO";

export class EventsResponse extends ResponseWrapper {
    events: EventDTO []

    constructor(copy?: Partial<EventsResponse>) {
        super()
        cloneAttributes<EventsResponse>(copy, this)
    }
}
