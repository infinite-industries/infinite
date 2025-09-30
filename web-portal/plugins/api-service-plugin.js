
export default defineNuxtPlugin({
  name: 'api-service',
  async setup (nuxtApp) {
    const { user } = useUserSession()

    return {
      provide: {
        'apiService': new ApiService(nuxtApp.$config.public.apiUrl, user)
      }
    }
  }
})

class ApiService {
  constructor(apiUrl, user) {
    this.apiUrl = apiUrl
    this.user = user
  }

  async get(path) {
    const userToken = this.user?.value?.token
    const headers = userToken ? { 'x-access-token': userToken } : undefined

    return await $fetch(`${this.apiUrl}${path}`, {
      headers
    })
  }

  post(path, postBody) {
    const userToken = this.user?.value?.token
    const headers = userToken ? { 'x-access-token': userToken } : undefined

    return $fetch(`${this.apiUrl}${path}`, { method: "POST", body: postBody, headers })
  }

  put(path, body) {
    const userToken = this.user?.value?.token
    const headers = userToken ? { 'x-access-token': userToken } : undefined

    return $fetch(`${this.apiUrl}${path}`, { method: "PUT", body, headers })
  }

  delete(path) {
    const userToken = this.user?.value?.token
    const headers = userToken ? { 'x-access-token': userToken } : undefined

    return $fetch(`${this.apiUrl}${path}`, { method: "DELETE", headers })
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
