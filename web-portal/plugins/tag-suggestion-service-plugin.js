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
  getBaseTagSuggestions() {
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
   */
  async getSuggestionsForDescription(description) {
    const response = await this.$apiService.post('/summarization/get-tags', { description })
    return response.data
  }
}
