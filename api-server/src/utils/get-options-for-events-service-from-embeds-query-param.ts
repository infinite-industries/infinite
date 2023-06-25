import { FindOptions } from 'sequelize';
import { VenueModel } from '../venues/models/venue.model';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DatetimeVenueModel } from '../events/models/datetime-venue.model';
import { EventAdminMetadataModel } from '../events/models/event-admin-metadata.model';

type EmbedableModels =
  | typeof VenueModel
  | typeof DatetimeVenueModel
  | typeof EventAdminMetadataModel;

const VENUE = 'Venue';
const DATE_TIME = 'DATE_TIME';
const ADMIN_META_DATA = 'ADMIN_META_DATA';

export function getOptionsForEventsServiceFromEmbedsQueryParam(
  embedsFromQueryString: string[] | string,
): FindOptions {
  const modelNames = ensureEmbedQueryStringIsArray(embedsFromQueryString);

  if (modelNames.length === 0) {
    return {};
  } else {
    const include = getModelsForEmbedding(modelNames);

    return { include };
  }
}

export function ensureEmbedQueryStringIsArray(
  embedsFromQueryString: string[] | string,
): string[] {
  return typeof embedsFromQueryString === 'string'
    ? [embedsFromQueryString]
    : embedsFromQueryString;
}

function getModelsForEmbedding(modelNames: string[]): EmbedableModels[] {
  return modelNames.map((modelName) => {
    if (modelName === VENUE) {
      return VenueModel;
    } else if (modelName === DATE_TIME) {
      return DatetimeVenueModel;
    } else if (modelName === ADMIN_META_DATA) {
      return EventAdminMetadataModel;
    } else {
      throw new HttpException(
        `"${modelName}" is not an allowable embed`,
        HttpStatus.BAD_REQUEST,
      );
    }
  });
}
