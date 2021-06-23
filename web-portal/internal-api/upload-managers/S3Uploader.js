const aws = require('aws-sdk')

module.exports = class S3Uploader {
  constructor(urlBase, region, accessKeyId, secretAccessKey, bucket) {
    this.urlBase = urlBase + bucket
    this.region = region
    this.bucket = bucket

    this.s3 = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey
    })
  }

  upload(path, data) {
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        Body: data,
        Bucket: this.bucket,
        Key: path
      }, (err) => {
        if (err) reject(err)
        else resolve(this.urlBase + '/' + path)
      })
    })
  }
}
