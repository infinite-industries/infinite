import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import {Event} from '../models/event.model'

export class EventsResponse extends ResponseWrapper {
    events: Event []

    constructor(copy?: Partial<EventsResponse>) {
        super()

        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<EventsResponse>(copy, this)
        }
    }
}
