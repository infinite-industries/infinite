import { join, resolve } from 'path';
import mkdirp from 'mkdirp';

export const PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS = resolve(
  join(__dirname, 'static', 'event-images'),
);

// Ensure the local upload directory exists, even when running from dist.
mkdirp.sync(PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS);
