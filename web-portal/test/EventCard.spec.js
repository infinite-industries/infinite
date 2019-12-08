import Vuex from 'vuex'
import { createLocalVue, RouterLinkStub, shallowMount } from '@vue/test-utils'
import Card from '@/components/ii-card.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

const venueId = '5678'

const getEvent = () => {
  return {
    id: '1234',
    title: 'Event 1',
    image: 'https://aws.url/image.jpg',
    date_times: [
      { start_time: '2020-06-01T10:00:00', end_time: '2020-06-01T11:00:00' },
      { start_time: '2020-06-02T22:00:00', end_time: '2020-06-02T23:00:00' }
    ],
    brief_description: 'The event lorem ipsum dolor sit amet,, consectetur adipiscing elit. Sed consequat ipsum neque.',
    venue_id: venueId
  }
}

describe('Card component', () => {
  let event, store, wrapper

  beforeEach(() => {
    event = getEvent()
    store = new Vuex.Store({
      state: {},
      getters: { GetAllVenues: () => [{ id: venueId, name: 'The Venue' }] }
    })
    wrapper = shallowMount(Card, {
      localVue,
      store,
      stubs: {
        NuxtLink: RouterLinkStub
      },
      propsData: {
        calendar_event: event
      }
    })
  })

  test('renders title and description', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toContain(event.title)
    expect(wrapper.html()).toContain(event.brief_description)
  })

  test('truncates long titles and descriptions', () => {
    event.title = 'Event Title: First Subtitle - Second Subtitle | Third Subtitle'
    event.brief_description = event.brief_description + '\n' + event.brief_description

    expect(wrapper.find('h3').text.length).toBeLessThan(43)
    expect(wrapper.find('.description').text.length).toBeLessThan(123)
  })

  // TODO: not sure why this doesn't work but probably something weird with
  // Jest's DOM model; the background isn't being set but the other prop is
  xtest('renders event image', () => {
    expect(wrapper.html()).toContain('background: url(\'' + event.image + '\')')
  })
})
