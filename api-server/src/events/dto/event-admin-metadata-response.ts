import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import {EventAdminMetadataModel} from "../models/event-admin-metadata.model";

export default class EventAdminMetadataResponse extends ResponseWrapper {
    eventAdminMetadata: EventAdminMetadataModel

    constructor(copy?: Partial<EventAdminMetadataResponse>) {
        super()

        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<EventAdminMetadataResponse>(copy, this)
        }
    }
}
