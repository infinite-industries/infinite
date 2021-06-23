
/**
 * Upload event images to AWS
 */

const fs = require('fs')
const multiparty = require('multiparty')
const uuidv4 = require('uuid/v4')
const logger = require('./utils').logger
const LocalUploader = require('./upload-managers/LocalUploader')
const S3Uploader = require('./upload-managers/S3Uploader')

const IMAGE_DESTINATIONS = {
  event: {
    hero: id => 'uploads/' + id + '.jpg',
    social: id => 'uploads/social/' + id + '_social.jpg'
  }
}

const TYPES = Object.keys(IMAGE_DESTINATIONS)

// Send images to AWS S3 only if all environment vars necessary to configure
// are present, falling back on local upload if not
// TODO: this check might be better refactored into a factory
// (especially if/when we introduce support for Azure Blob Storage)
const uploader = process.env.AWS_REGION &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_SERVER_URL &&
  process.env.AWS_S3_UPLOADS_BUCKET
  ? new S3Uploader(
    process.env.AWS_SERVER_URL,
    process.env.AWS_REGION,
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_S3_UPLOADS_BUCKET
  )
  : new LocalUploader(process.env.APP_URL)

if (process.env.NODE_ENV === 'production' && uploader instanceof LocalUploader) {
  logger.error('AWS credentials are not configured; uploads will be stored locally')
} else {
  logger.info(`Image uploads will save to ${uploader instanceof S3Uploader ? 'S3' : 'web server'}`)
}

export default function (req, res) {
  const form = new multiparty.Form()
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.statusCode = 400
      return res.end(err.message)
    }

    const uploadId = uuidv4()
    const uploadType = fields && fields.type ? fields.type[0].toString().toLowerCase() : null
    const fileKeys = Object.keys(files || {})

    // validation
    if (!uploadType || !TYPES.includes(uploadType)) {
      res.statusCode = 422
      res.end(uploadType ? `Invalid upload type ${uploadType}` : 'Upload type not specified')
    }

    if (!fileKeys.every(file => !!IMAGE_DESTINATIONS[uploadType][file.toLowerCase()])) {
      res.statusCode = 422
      res.end(
        'Unknown file type ' +
        fileKeys.find(file => !IMAGE_DESTINATIONS[uploadType][file.toLowerCase()])
      )
    }

    Promise.all(
      fileKeys.map(
        file => new Promise((resolve, reject) => {
          const type = file.toLowerCase()
          const path = files[file][0].path
          logger.info(`uploading ${type} image --- ${path}`)
          fs.readFile(path, function (err, data) {
            if (err) return reject(err)
            const finalPath = IMAGE_DESTINATIONS[uploadType][type](uploadId)
            uploader.upload(finalPath, data).then((url) => {
              resolve({ [type]: url })
            }).catch(reject)
          })
        })
      )
    ).then(function (urls) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(urls.reduce((memo, url) => Object.assign({}, memo, url))))
    }).catch(function (err) {
      logger.error(`error handling image upload: ${err}`)
      res.statusCode = 500
      res.end(err.message)
    })
  })
}
