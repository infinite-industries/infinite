import Vuetify from 'vuetify'

import { createLocalVue, RouterLinkStub, mount } from '@vue/test-utils'
import AdminEventsList from '@/components/AdminEventsList.vue'

const localVue = createLocalVue()
localVue.use(Vuetify)

const getEventList = () => {
  return [
    { title: 'Event 1', date_times: [{ start_time: '2020-06-01T10:00:00', end_time: '2020-06-01T11:00:00' }] },
    { title: 'Event 2', date_times: [{ start_time: '2020-06-02T22:00:00', end_time: '2020-06-02T23:00:00' }] }
  ]
}

describe('AdminEventsList component', () => {
  test('renders a list of events', () => {
    const wrapper = mount(AdminEventsList, {
      localVue,
      stubs: {
        NuxtLink: RouterLinkStub
      },
      propsData: {
        calendar_events: getEventList()
      }
    })

    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.html()).toContain(getEventList()[0].title)
    expect(wrapper.html()).toContain('June 1st 10:00am - 11:00am')
    expect(wrapper.html()).toContain(getEventList()[1].title)
    expect(wrapper.html()).toContain('June 2nd 10:00pm - 11:00pm')
  })
})
