import {ApiProperty} from "@nestjs/swagger";

export class ResponseWrapper {
    @ApiProperty({example: 'success'})
    status = 'success'
}

