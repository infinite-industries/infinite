import {ApiProperty} from "@nestjs/swagger";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import {v4 as uuidv4} from 'uuid';

const SAMPLE_GUID_1 = uuidv4()
const SAMPLE_GUID_2 = uuidv4()

export class UserInfoResp {
    @ApiProperty({ example: SAMPLE_GUID_1 })
    id: string

    @ApiProperty({ example: 'Семён Лямкин' })
    name: string

    @ApiProperty( { example: 'TylerDurden' })
    nickname: string

    @ApiProperty({ example: true })
    isInfiniteAdmin: boolean

    @ApiProperty({ example: [SAMPLE_GUID_2] })
    venueIDs?: string[]

    constructor(copy?: UserInfoResp) {
        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<UserInfoResp>(copy, this)
        }
    }
}
