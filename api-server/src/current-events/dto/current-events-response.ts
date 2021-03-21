import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import {CurrentEvent} from "../models/current-event.model";

export class CurrentEventsResponse extends ResponseWrapper {
    events: CurrentEvent []

    constructor(copy?: Partial<CurrentEventsResponse>) {
        super()

        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<CurrentEventsResponse>(copy, this)
        }
    }
}
