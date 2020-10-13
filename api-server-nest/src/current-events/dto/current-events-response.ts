import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/colone-attributes";
import {CurrentEvent} from "./current-event.model";

export class CurrentEventsResponse extends ResponseWrapper {
    events: CurrentEvent []

    constructor(copy?: Partial<CurrentEventsResponse>) {
        super()

        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<CurrentEventsResponse>(copy, this)
        }
    }
}
