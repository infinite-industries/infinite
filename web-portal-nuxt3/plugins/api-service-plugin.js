
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      'apiService': new ApiService(nuxtApp.$config.public.apiUrl)
    }
  }
})

class ApiService {
  constructor(apiUrl) {
    console.log(apiUrl)
    this.apiUrl = apiUrl
  }

  get(path, idToken) {
    const userToken = formatToken(idToken)

    // TODO: thread through the ID token (or rely on $fetch to thread it through?)
    return $fetch(`${this.apiUrl}${path}`)
    // return axios.get(this.apiUrl + path, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  post(path, postBody, idToken) {
    const userToken = formatToken(idToken)

    // TODO: thread through the ID token (or rely on $fetch to thread it through?)
    return $fetch(`${this.apiUrl}/${path}`, { method: "POST", body: postBody })
    // return axios.post(this.apiUrl + path, postBody, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  put(path, body, idToken) {
    const userToken = formatToken(idToken)

    // TODO: thread through the ID token (or rely on $fetch to thread it through?)
    return $fetch(`${this.apiUrl}/${path}`, { method: "PUT", body })
    // return axios.put(this.apiUrl + path, body, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  delete(path, idToken) {
    const userToken = formatToken(idToken)

    // TODO: thread through the ID token (or rely on $fetch to thread it through?)
    return $fetch(`${this.apiUrl}/${path}`, { method: "DELETE" })
    // return axios.delete(this.apiUrl + path, idToken ? { headers: { 'x-access-token': userToken } } : null)
  }

  // unclear if there's a $fetch equivalent for this
  // all(calls) {
  //   return axios.all(calls)
  // }

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
