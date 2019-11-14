import axios from 'axios'
const API_URL = process.env.API_URL

export class ApiService {
  static get(path, idToken) {
    const userToken = ApiService.formatToken(idToken)

    return axios.get(API_URL + path, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  static post(path, postBody, idToken) {
    const userToken = ApiService.formatToken(idToken)

    return axios.post(API_URL + path, postBody, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  static put(path, body, idToken) {
    const userToken = ApiService.formatToken(idToken)
    return axios.put(API_URL + path, body, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  static delete(path, idToken) {
    const userToken = ApiService.formatToken(idToken)

    return axios.delete(API_URL + path, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  static makeApiCall(verb, path, postBody, apiKey, userToken) {
    let url = API_URL + '/' + path
    let args = []

    if (apiKey && (verb === 'get' || verb === 'delete')) {
      url += '?apikey=' + apiKey
    } else if (apiKey) {
      postBody = postBody || {}
      postBody.apikey = apiKey
    }

    if (userToken) {
      if (verb === 'get' || verb === 'delete') {
        args = [url, { headers: { 'x-access-token': userToken } }]
      } else {
        args = [url, postBody, { headers: { 'x-access-token': userToken } }]
      }
    } else {
      args = [url, postBody]
    }

    // general event listings for the user's area
    return axios[verb].apply(axios, args)
  }

  static formatToken(idToken) {
    if (typeof idToken !== 'string') {
      return null
    }

    return idToken.replace('Bearer ', '')
  }
}
