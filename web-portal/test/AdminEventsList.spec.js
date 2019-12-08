import Vuetify from 'vuetify'

import { createLocalVue, RouterLinkStub, mount } from '@vue/test-utils'
import AdminEventsList from '@/components/AdminEventsList.vue'

const localVue = createLocalVue()
localVue.use(Vuetify)

const getEventList = () => {
  return [
    { title: 'Event 1', date_times: [] },
    { title: 'Event 2', date_times: [] }
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

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toContain(getEventList()[0].title)
    expect(wrapper.html()).toContain(getEventList()[1].title)
  })
})
