
/**
 * Upload event images to AWS
 */

const fs = require('fs')
const aws = require('aws-sdk')
const multiparty = require('multiparty')
const uuidv4 = require('uuid/v4')

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const IMAGE_DESTINATIONS = {
  event: {
    hero: id => 'uploads/' + id + '.jpg',
    social: id => 'uploads/social/' + id + '_social.jpg'
  }
}

const TYPES = Object.keys(IMAGE_DESTINATIONS)

const s3UrlBase = process.env.AWS_SERVER_URL + process.env.AWS_S3_UPLOADS_BUCKET

export default function (req, res, next) {
  const form = new multiparty.Form()
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.statusCode = 400
      return res.end(err.message)
    }

    const uploadId = uuidv4()
    const uploadType = fields.type ? fields.type[0].toString().toLowerCase() : null
    const fileKeys = Object.keys(files)

    // validation
    if (!uploadType || !TYPES.includes(uploadType)) {
      res.statusCode = 422
      res.end(uploadType ? 'Invalid upload type' + uploadType : 'Upload type not specified')
    }

    if (!fileKeys.every(file => !!IMAGE_DESTINATIONS[uploadType][file.toLowerCase()])) {
      res.statusCode = 422
      res.end(
        'Unknow file type ' +
        fileKeys.find(file => !IMAGE_DESTINATIONS[uploadType][file.toLowerCase()])
      )
    }

    Promise.all(
      fileKeys.map(
        file => new Promise((resolve, reject) => {
          const type = file.toLowerCase()
          const path = files[file][0].path
          console.log('uploading ' + type + ' image ---' + path)
          fs.readFile(path, function (err, data) {
            if (err) return reject(err)
            const s3Name = IMAGE_DESTINATIONS[uploadType][type](uploadId)
            s3.putObject({
              Body: data,
              Bucket: process.env.AWS_S3_UPLOADS_BUCKET,
              Key: s3Name
            }, function (err, data) {
              if (err) reject(err)
              else resolve({ [type]: s3UrlBase + '/' + s3Name })
            })
          })
        })
      )
    ).then(function (urls) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(urls.reduce((memo, url) => Object.assign({}, memo, url))))
    }).catch(function (err) {
      console.error(err)
      res.statusCode = 500
      res.end(err.message)
    })
  })
}
