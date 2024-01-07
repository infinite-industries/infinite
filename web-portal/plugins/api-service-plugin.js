import axios from 'axios'

export default ({ app }, inject) => {
  inject('apiService', new ApiService(app.$config.API_URL))
}

class ApiService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl
  }

  get(path, idToken) {
    const userToken = formatToken(idToken)

    return axios.get(this.apiUrl + path, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  post(path, postBody, idToken) {
    const userToken = formatToken(idToken)

    return axios.post(this.apiUrl + path, postBody, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  put(path, body, idToken) {
    const userToken = formatToken(idToken)

    return axios.put(this.apiUrl + path, body, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  delete(path, idToken) {
    const userToken = formatToken(idToken)

    return axios.delete(this.apiUrl + path, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  all(calls) {
    return axios.all(calls)
  }

  uploadEventImage(file) {
    const data = new FormData()
    data.append('type', 'event')
    data.append('file', file)

    return this.post('/uploads/event-image', data)
  }
}

function formatToken(idToken) {
  if (typeof idToken !== 'string') {
    return null
  }

  return idToken.replace('Bearer ', '')
}
