export default ({ app }, inject) => {
  inject('tagSuggestionService', new TagSuggestionService(app.$apiService))
}

class TagSuggestionService {
  constructor(apiService) {
    this.$apiService = apiService
  }

  /**
   * Return the set of base tags we've historically offerred as suggestions
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
      const response = await this.$apiService.post('/summarization/get-tags', { description })
      return response.data?.length > 0 ? response.data : null
    } catch (e) {
      return null
    }
  }
}
