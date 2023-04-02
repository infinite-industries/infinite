import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";

export class GetGPSCoordinatesFromAddressRequest {
    @ApiProperty({ example: '421 Somehorse Rd' })
    @IsNotEmpty()
    street: string;

    @ApiProperty({ example: 'Lexington' })
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'KY' })
    @IsNotEmpty()
    state: string;

    @ApiProperty({ example: '40508' })
    @IsNotEmpty()
    zip: string;
}

export interface GPSCoordinates {
    latitude: number;
    longitude: number;
    altitude?: number;
}

export class GetGPSCoordinatesResponse extends ResponseWrapper {
    gpsCoordinates: GPSCoordinates

    constructor(copy?: Partial<GetGPSCoordinatesResponse>) {
        super(copy)

        if (isNotNullOrUndefined(copy)) {
            this.gpsCoordinates = copy.gpsCoordinates
        }
    }
}
