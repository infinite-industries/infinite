import {Injectable} from "@nestjs/common";
import {Nullable} from "../utils/NullableOrUndefinable";
import {GPSCoordinates} from "./dto/GetGPSCoordinatesRequest";
import isNotNullOrUndefined from "../utils/is-not-null-or-undefined";
import {isNullOrUndefined} from "../utils";
import * as https from "https";

@Injectable()
export class GpsService {
    async getCoordinatesFromGoogleMapLink(googleMapLink: string): Promise<Nullable<GPSCoordinates>> {
        // see if the link has the coordinates embedded
        const [hasCoordinatesInUrl, coordinateValues] = this.isUrlWithMatch(googleMapLink)

        if (hasCoordinatesInUrl) {
            return this.fromCoordinateValuesString(coordinateValues)
        } else {
            // some links are shortened, but will redirect to a full url with the coordinates embedded, use the full url
            const resolvedRedirectUrl = await this.getRedirectUrl(googleMapLink)

            const [hasCoordinatesInRedirectUrl, redirectCoordinateValues] = this.isUrlWithMatch(resolvedRedirectUrl)

            return hasCoordinatesInRedirectUrl ? this.fromCoordinateValuesString(redirectCoordinateValues) : null
        }
    }

    private isUrlWithMatch(url: string): [boolean, Nullable<string>] {
        const match = url.match(/@-?[0-9]*([.][0-9]*)?,-?[0-9]*([.][0-9]*)?,-?[0-9]*([.][0-9].*)?z/gi)

        if (isNullOrUndefined(match) || match.length <= 0) {
            return [false, null]
        }

        return [true, match[0]]
    }

    private fromCoordinateValuesString(coordinateValues: string): Nullable<GPSCoordinates> {
        const values = coordinateValues.replace('@', '').split(',')
        const latitude = Number(values[0])
        const longitude = Number(values[1])
        const altitude = Number( isNotNullOrUndefined(values[2]) ? values[2].replace('z', '') : null)

        if (isNaN(latitude) || isNaN(longitude) || isNaN(altitude)) {
            return null
        }

        return {
            latitude,
            longitude,
            altitude
        }
    }

    private getRedirectUrl(url): Promise<string> {
        return new Promise((resolve, reject) => {
          https.get(url, (res) => {
              if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
                 resolve(res.headers.location)
              } else {
                 reject('no redirect url returned')
              }
          })
        })
    }
}
