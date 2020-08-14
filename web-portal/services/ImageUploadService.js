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
}
