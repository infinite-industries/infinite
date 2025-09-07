
export default defineNuxtPlugin({
  name: 'suggestion-service',
  dependsOn: ['api-service'],
  async setup (nuxtApp) {
    const suggestionService = new SuggestionService(nuxtApp.$apiService)
    nuxtApp.vueApp.use({
      install(app) {
        app.config.globalProperties.$suggestionService = suggestionService
      }
    })
  }
})

class SuggestionService {
  constructor(apiService) {
    this.$apiService = apiService
  }

  /**
   * Return the set of base tags we've historically offered as suggestions
   */
  getBaseTagSet() {
    return [
      'gallery',
      'music',
      'theater',
      'dance',
      'film',
      'literary arts',
      'talk',
      'festival',
      'comedy'
    ]
  }

  /**
   * Return tag suggestions for an event's description
   *
   * On empty array response or error, returns null
   */
  async getSuggestionsForDescription(description) {
    try {
      const data = await this.$apiService.post('/summarization/get-tags', { description })
      return data?.length > 0 ? data : null
    } catch (e) {
      return null
    }
  }

  async getBriefDescriptionFromFullDescription(description) {
    try {
      const data = await this.$apiService.post('/summarization/get-brief-description', { description })
      return data
    } catch (e) {
      console.warn(e)
      return null
    }
  }

  async submitFeedback(suggested, submitted, eventId) {
    await $fetch('/internal-api/analytics/suggestion-feedback', { method: 'POST', body: { suggested, submitted, eventId } })
  }
}
