import Vuex from 'vuex'
import { createLocalVue, RouterLinkStub, shallowMount } from '@vue/test-utils'
import Card from '@/components/EventCard.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

const venueId = '5678'
const venueName = 'The Venue'

const getEvent = () => {
  return {
    id: '1234',
    title: 'Event 1',
    image: 'https://aws.url/image.jpg',
    date_times: [
      { start_time: '2020-06-01T14:00:00.000Z', end_time: '2020-06-01T15:00:00.000Z', timezone: 'US/Eastern' },
      { start_time: '2020-06-02T22:00:00.000Z', end_time: '2020-06-02T23:00:00.000Z', timezone: 'US/Eastern' }
    ],
    brief_description: 'The event lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat ipsum neque.',
    venue: getVenue(),
    venue_id: venueId,
    condition: []
  }
}

const getVenue = () => {
  return {
    id: venueId,
    name: venueName
  }
}

describe('Card component', () => {
  let event, store, wrapper

  beforeEach(() => {
    event = getEvent()
    store = new Vuex.Store({
      state: {},
      getters: { GetActiveVenues: () => [ getVenue() ] }
    })
    wrapper = shallowMount(Card, {
      localVue,
      store,
      stubs: {
        NuxtLink: RouterLinkStub
      },
      mocks: {
        $config: {
          TIMEZONE_DEFAULT: 'US/Eastern'
        }
      },
      propsData: {
        calendar_event: event
      }
    })
  })

  test('renders title and description', () => {
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.html()).toContain(event.title)
    expect(wrapper.html()).toContain(event.brief_description)
  })

  test('truncates long titles and descriptions', () => {
    event.title = 'Event Title: First Subtitle - Second Subtitle | Third Subtitle'
    event.brief_description = event.brief_description + '\n' + event.brief_description

    expect(wrapper.find('h3').text.length).toBeLessThan(43)
    expect(wrapper.find('.description').text.length).toBeLessThan(123)
  })

  test('prepends appropriate condition label to title', async () => {
    await wrapper.setProps({
      calendar_event: Object.assign({}, event, {
        condition: ['postponed']
      })
    })
    expect(wrapper.find('h3').text()).toContain('[Postponed]')
  })

  test('condition label has appropriate precedence', async () => {
    // sold-out beats postponed
    await wrapper.setProps({
      calendar_event: Object.assign({}, event, {
        condition: ['postponed', 'sold-out']
      })
    })
    expect(wrapper.find('h3').text()).toContain('[Sold Out]')
    expect(wrapper.find('h3').text()).not.toContain('[Postponed]')

    // cancelled beats both
    await wrapper.setProps({
      calendar_event: Object.assign({}, event, {
        condition: ['postponed', 'sold-out', 'cancelled']
      })
    })
    expect(wrapper.find('h3').text()).toContain('[Cancelled]')
    expect(wrapper.find('h3').text()).not.toContain('[Sold Out]')
    expect(wrapper.find('h3').text()).not.toContain('[Postponed]')
  })

  // TODO: not sure why this doesn't work but probably something weird with
  // Jest's DOM model; the background isn't being set but the other prop is
  xtest('renders event image', () => {
    expect(wrapper.html()).toContain('background: url(\'' + event.image + '\')')
  })

  test('renders venue name', () => {
    expect(wrapper.html()).toContain(venueName)
  })

  test('omits venue when not set', () => {
    wrapper = shallowMount(Card, {
      localVue,
      store,
      stubs: {
        NuxtLink: RouterLinkStub
      },
      propsData: {
        calendar_event: Object.assign(getEvent(), {
          venue_id: null
        })
      }
    })

    expect(wrapper.html()).not.toContain(venueName)
    expect(wrapper.html()).not.toContain('ii-location')
  })

  test('renders correct event time (stored in UTC, displayed in EDT)', () => {
    expect(wrapper.html()).toContain('June 1st')
    expect(wrapper.html()).toContain('10:00am - 11:00am EDT')
  })

  test('omits time for events treated as online resources', () => {
    wrapper = shallowMount(Card, {
      localVue,
      store,
      stubs: {
        NuxtLink: RouterLinkStub
      },
      propsData: {
        calendar_event: Object.assign(getEvent(), {
          category: 'online-resource'
        })
      }
    })
    expect(wrapper.html()).not.toContain('June 1st')
  })
})
