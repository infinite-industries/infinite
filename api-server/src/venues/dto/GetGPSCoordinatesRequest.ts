import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {ResponseWrapper} from "../../dto/response-wrapper";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";

export default class GetGPSCoordinatesRequest {
    @ApiProperty({ example: 'https://goo.gl/maps/EE4fh4heUJ3WoLGV6' })
    @IsNotEmpty()
    googleMapsLink: string;
}

export interface GPSCoordinates {
    latitude: number;
    longitude: number;
    altitude: number;
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
