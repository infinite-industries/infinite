import axios from 'axios'

const URL = '/internal-api/images'

export default class ImageUploadService {
  static forEvent(heroImage, socialImage) {
    const data = new FormData()
    data.append('type', 'event')
    if (heroImage) data.append('hero', heroImage)
    if (socialImage) data.append('social', socialImage)
    return axios.post(URL, data)
  }

  static asDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.addEventListener('load', e => resolve(e.target.result))
      reader.addEventListener('error', e => reject(e))
      reader.readAsDataURL(file)
    })
  }
}
