const fs = require('fs')
const { join, resolve } = require('path')

const LOCAL_UPLOAD_ROOT = resolve(__dirname, '../../static')

module.exports = class LocalUploader {
  constructor(urlBase) {
    this.urlBase = urlBase
  }

  upload(path, data) {
    return new Promise((resolve, reject) => {
      // wx flag mitigates the possibility of clobbering an existing file
      // (will error out on write)
      fs.writeFile(join(LOCAL_UPLOAD_ROOT, path), data, { flag: 'wx' }, (err) => {
        if (err) reject(err)
        else resolve(this.urlBase + '/' + path)
      })
    })
  }
}
