
export default class ImageUploadService {
  static asDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.addEventListener('load', e => resolve(e.target.result))
      reader.addEventListener('error', e => reject(e))
      reader.readAsDataURL(file)
    })
  }
}
