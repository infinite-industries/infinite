import { createStore } from 'vuex'
import { shallowMount } from '@vue/test-utils'
import ListViewer from '@/components/ListViewer.vue'

const getEventList = () => {
  return [
    { title: 'Event 1', date_times: [{ start_time: '2020-06-01T10:00:00', end_time: '2020-06-01T11:00:00' }] },
    { title: 'Event 2', date_times: [{ start_time: '2020-06-02T22:00:00', end_time: '2020-06-02T23:00:00' }] }
  ]
}

describe('ListViewer component', () => {
  let events, store, wrapper

  beforeEach(() => {
    events = getEventList()
    store = createStore({
      getters: { GetLoadingStatus: () => false }
    })
    wrapper = shallowMount(ListViewer, {
      global: {
        plugins: [store]
      },
      propsData: {
        calendar_events: events
      }
    })
  })

  test('renders a list of events', () => {
    expect(wrapper.vm).toBeTruthy() // is a vue instance

    // verify that the list contains two "cards" and that they
    // were each passed the correct event as a prop
    // (cards are stubbed out since component is shallow mounted)
    const cards = wrapper.findAllComponents({ name: 'EventCard' })
    expect(cards.length).toBe(2)
    expect(cards.at(0).props('calendar_event')).toEqual(events[0])
    expect(cards.at(1).props('calendar_event')).toEqual(events[1])
  })
})
