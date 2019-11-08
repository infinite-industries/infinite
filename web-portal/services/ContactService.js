import axios from 'axios'

const URL = '/internal-api/slack-alert'

export default class ContactService {
  static sendMessage(name, email, comment) {
    return axios.post(URL, { name, email, comment })
  }
}
