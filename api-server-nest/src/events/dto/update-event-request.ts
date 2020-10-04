import {CreateEventRequest} from "./create-event-request";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/colone-attributes";
import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";

export class UpdateEventRequest extends CreateEventRequest {
    constructor(copy?: UpdateEventRequest) {
        super()

        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<UpdateEventRequest>(copy, this)
        }
    }

    @ApiProperty({ example: false })
    @IsOptional()
    verified: boolean
}
