import {HttpException, Injectable} from "@nestjs/common";
import {Nullable} from "../utils/NullableOrUndefinable";
import {GPSCoordinates} from "./dto/GetGPSCoordinatesRequest";
import {isNullOrUndefined} from "../utils";
import * as NodeGeocoder from "node-geocoder";
import {MAP_BOX_API_KEY} from "../constants";

@Injectable()
export class GpsService {
    async getCoordinatesFromAddress({ street, city, state, zip }: AddressIdentifier): Promise<Nullable<GPSCoordinates>> {
        if (isNullOrUndefined(MAP_BOX_API_KEY)) {
            console.warn("attention developer, did you forget to set MAP_BOX_API_KEY")
            throw new HttpException("The server does not have an API token set for gps access", 500)
        }

        const geocoder = NodeGeocoder({
            provider: 'mapbox',
            apiKey: MAP_BOX_API_KEY,
        });

        const matches = await geocoder.geocode(`${street} ${city}, ${state} ${zip}`);

        if (matches.length === 0) {
            return  null
        }

        const match = matches[0]

        return {
            latitude: match.latitude,
            longitude: match.longitude,
        }
    }
}

type AddressIdentifier = {
    city: string,
    state: string,
    zip: string,
    street: string
}
