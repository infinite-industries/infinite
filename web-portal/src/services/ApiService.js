import { API_URL } from 'babel-dotenv'
import axios from 'axios'

export class ApiService {
  static get(path) {
    return axios.get(API_URL + path)
  }

  static post(path, postBody) {
    return axios.post(API_URL + path, postBody)
  }

  static put(path, body) {
    return axios.put(API_URL + path, body)
  }

  static delete(path) {
    return axios.delete(API_URL + path)
  }

  static makeApiCall(verb, path, postBody, apiKey, userToken) {
    let url = API_URL + '/' + path
    let args = []

    if (apiKey && (verb === 'get' || verb === 'delete')) {
      url += '?apikey=' + apiKey
    } else if(apiKey) {
      postBody = postBody || {}
      postBody.apikey = apiKey
    }

    if (userToken) {
      if (verb === 'get' || verb === 'delete') {
        args = [url, { headers: {'x-access-token': userToken } }]
      } else {
        args = [url, postBody, { headers: {'x-access-token': userToken } }]
      }
    } else {
      args = [url, postBody]
    }

    // general event listings for the user's area
    return axios[verb].apply(axios, args)
  }
}
