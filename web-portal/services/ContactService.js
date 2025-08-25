
const URL = '/internal-api/slack-alert'

export default class ContactService {
  static sendMessage(name, email, comment) {
    return $fetch(URL, { method: 'POST', body: { name, email, comment } })
  }
}
