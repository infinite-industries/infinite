import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import {VenueModel} from "../models/venue.model";

export class VenuesResponse extends ResponseWrapper {
    venues: VenueModel []

    constructor(copy?: Partial<VenuesResponse>) {
        super()

        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<VenuesResponse>(copy, this)
        }
    }
}
