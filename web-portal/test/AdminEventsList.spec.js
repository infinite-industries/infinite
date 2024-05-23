import { createLocalVue, RouterLinkStub, mount } from '@vue/test-utils'
import AdminEventsList from '@/components/AdminEventsList.vue'

const localVue = createLocalVue()

const getEventList = () => {
  return [
    { title: 'Event 1', date_times: [{ start_time: '2020-06-01T14:00:00+00', end_time: '2020-06-01T15:00:00+00', timezone: 'US/Eastern' }] },
    { title: 'Event 2', date_times: [{ start_time: '2020-06-03T02:00:00+00', end_time: '2020-06-03T03:00:00+00', timezone: 'US/Eastern' }] }
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
    expect(wrapper.html()).toContain('June 1st 10:00am - 11:00am EDT')
    expect(wrapper.html()).toContain(getEventList()[1].title)
    expect(wrapper.html()).toContain('June 2nd 10:00pm - 11:00pm EDT')
  })
})
