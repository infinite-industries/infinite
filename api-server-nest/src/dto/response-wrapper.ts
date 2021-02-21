import {ApiProperty} from "@nestjs/swagger";
import isNotNullOrUndefined from "../utils/is-not-null-or-undefined";

export class ResponseWrapper {
    @ApiProperty({example: 'success'})
    status = 'success'

    constructor(copy?: Partial<ResponseWrapper>) {
        if (isNotNullOrUndefined(copy) && isNotNullOrUndefined(copy.status)) {
            this.status = copy.status;
        }
    }
}
