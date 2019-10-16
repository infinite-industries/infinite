const APP_URL = process.env.APP_URL

export default class PageMetaService {
  static urlFor(route) {
    return APP_URL + route
  }
}
