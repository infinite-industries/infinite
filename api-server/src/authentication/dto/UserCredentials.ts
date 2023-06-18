import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UserCredentials {
    @ApiProperty({ example: 'test-admin@infinite.industries' })
    @IsNotEmpty()
    username: string

    @ApiProperty({ example: 'xxx' })
    @IsNotEmpty()
    password: string
}
