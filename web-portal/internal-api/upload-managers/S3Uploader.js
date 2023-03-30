const { S3 } = require("@aws-sdk/client-s3")

module.exports = class S3Uploader {
  constructor(bucket) {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1'
    this.bucket = bucket
    this.public_url = `https://${bucket}.s3.${region}.amazonaws.com/`
    this.s3 = new S3()
  }

  upload(path, data) {
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        Body: data,
        Bucket: this.bucket,
        Key: path
      }, (err) => {
        if (err) reject(err)
        else resolve(this.public_url + path)
      })
    })
  }
}
