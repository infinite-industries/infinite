import {FindOptions} from "sequelize";
import {Venue} from "../venues/models/venue.model";
import {HttpException, HttpStatus} from "@nestjs/common";

type EmbedableModels = typeof Venue

const VENUE = 'Venue';

export function getOptionsForEventsServiceFromEmbedsQueryParam(embedsFromQueryString: string[] | string): FindOptions {
    const modelNames = ensureEmbedQueryStringIsArray(embedsFromQueryString);

    if (modelNames.length === 0) {
        return {};
    } else {
        const include = getModelsForEmbedding(modelNames);

        return {include};
    }
}

function ensureEmbedQueryStringIsArray(embedsFromQueryString: string[] | string): string [] {
    return typeof embedsFromQueryString === 'string' ? [embedsFromQueryString] : embedsFromQueryString;
}

function getModelsForEmbedding(modelNames: string[]): EmbedableModels [] {
    return modelNames.map(modelName => {
        if (modelName === VENUE) {
            return Venue;
        } else {
            throw new HttpException(`"${modelName}" is not an allowable embed`, HttpStatus.BAD_REQUEST);
        }
    });
}
