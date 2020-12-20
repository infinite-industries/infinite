import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateOrUpdateAnnouncementRequest {
    constructor(copy?: CreateOrUpdateAnnouncementRequest) {
        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<CreateOrUpdateAnnouncementRequest>(copy, this)
        }
    }

    @ApiProperty({example: 'Life is not a dream. Beware. And beware. And beware.'})
    @IsNotEmpty()
    message: string
}
