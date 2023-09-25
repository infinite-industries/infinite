import Vuex from 'vuex'
import Vuetify from 'vuetify'
// import moment from 'moment'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import SubmissionForm from '../components/SubmissionForm'
import { getEmptyCalendarEvent } from '../services/ResourceTemplateService'

import ImageUploadService from '@/services/ImageUploadService'

jest.mock('@/services/ImageUploadService')

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuetify)

/**
 * When submission was refactored (Nov 2021) the only test case here
 * was rendered irrelevant. Keeping this for reference for future testing
 * of this component.
 */
describe('SubmissionForm component', () => {
  let store = null
  let wrapper = null

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      getters: {
        GetCurrentEvent: () => {
          return getEmptyCalendarEvent()
        }
      }
    })

    wrapper = shallowMount(SubmissionForm, {
      localVue,
      store,
      propsData: {
        user_action: 'edit',
        user_role: 'regular'
      },
      stubs: {
        'vue-editor': true
      },
      mocks: {
        $apiService: { }
      }
    })
  })

  it('event mode defaults to in-person', function () {
    expect(wrapper.find('.event-mode input[type="radio"][value="in-person"]').element.checked).toBe(true)
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:in-person'])
  })

  it('event mode can be selected', async function () {
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:in-person'])
    await wrapper.find('.event-mode input[type="radio"][value="online"]').setChecked(true)
    expect(wrapper.vm.eventMode).toEqual('online')
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:online'])
  })

  it('event category can be selected', async function () {
    await wrapper.find('.event-category input[type="radio"][value="single-day-event"]').setChecked(true)
    expect(wrapper.vm.eventCategory).toEqual('single-day-event')
    expect(wrapper.vm.calendar_event.tags).toContain('category:single-day-event')
  })

  it('event category can be changed', async function () {
    await wrapper.find('.event-category input[type="radio"][value="single-day-event"]').setChecked(true)
    expect(wrapper.vm.eventCategory).toEqual('single-day-event')
    await wrapper.find('.event-category input[type="radio"][value="multi-day-event"]').setChecked(true)
    expect(wrapper.vm.eventCategory).toEqual('multi-day-event')
    expect(wrapper.vm.calendar_event.tags).toContain('category:multi-day-event')
    expect(wrapper.vm.calendar_event.tags).not.toContain('category:single-day-event')
  })

  it('event mode and category can be changed without affecting the other', async function () {
    await wrapper.find('.event-mode input[type="radio"][value="in-person"]').setChecked(true)
    await wrapper.find('.event-category input[type="radio"][value="single-day-event"]').setChecked(true)
    expect(wrapper.vm.eventMode).toEqual('in-person')
    expect(wrapper.vm.eventCategory).toEqual('single-day-event')
    await wrapper.find('.event-mode input[type="radio"][value="hybrid"]').setChecked(true)
    expect(wrapper.vm.eventMode).toEqual('hybrid')
    expect(wrapper.vm.eventCategory).toEqual('single-day-event')
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:hybrid', 'category:single-day-event'])
    await wrapper.find('.event-category input[type="radio"][value="multi-day-event"]').setChecked(true)
    expect(wrapper.vm.eventMode).toEqual('hybrid')
    expect(wrapper.vm.eventCategory).toEqual('multi-day-event')
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:hybrid', 'category:multi-day-event'])
  })

  it('event category "other" allows user-defined description', async function () {
    // input should not exist until "other" selected
    expect(wrapper.find('.category-other-description').exists()).toBe(false)
    await wrapper.find('.event-category input[type="radio"][value="other"]').setChecked(true)
    expect(wrapper.find('.category-other-description').exists()).toBe(true)

    // should be editable
    expect(wrapper.vm.eventCategory).toEqual('other')
    expect(wrapper.vm.calendar_event.tags).toEqual(expect.arrayContaining(['category:other']))
    // ideally we'd grab the '.category-other-description input' and set its value, but Jest
    // can't seem to find it; to work around that we're just setting the computed property
    wrapper.vm.eventCategoryOther = 'Something fun!'
    expect(wrapper.vm.eventCategory).toEqual('other')
    expect(wrapper.vm.calendar_event.tags).toEqual(expect.arrayContaining(['category:other:Something fun!']))
  })

  it('event category "other" can handle punctuation', async function () {
    await wrapper.setData({
      calendar_event: Object.assign({}, wrapper.vm.calendar_event, {
        tags: ['mode:in-person', 'category:other:Creativity']
      })
    })
    expect(wrapper.vm.eventCategoryOther).toEqual('Creativity')
    wrapper.vm.eventCategoryOther = 'Colons:are:special.'
    expect(wrapper.vm.eventCategory).toEqual('other')
    expect(wrapper.vm.calendar_event.tags).toEqual(expect.arrayContaining(['mode:in-person', 'category:other:Colons:are:special.']))
  })

  it('general tags are not affected by modifying control tags', async function () {
    await wrapper.setData({
      calendar_event: Object.assign({}, wrapper.vm.calendar_event, {
        tags: ['festival', 'mode:in-person']
      })
    })
    expect(wrapper.vm.generalTags).toEqual(['festival'])
    await wrapper.find('.event-mode input[type="radio"][value="hybrid"]').setChecked(true)
    await wrapper.find('.event-category input[type="radio"][value="single-day-event"]').setChecked(true)
    expect(wrapper.vm.generalTags).toEqual(['festival'])
    expect(wrapper.vm.calendar_event.tags).toEqual(expect.arrayContaining(['festival', 'mode:hybrid', 'category:single-day-event']))
  })

  it('control tags are not affected by modifying general tags', async function () {
    await wrapper.setData({
      calendar_event: Object.assign({}, wrapper.vm.calendar_event, {
        tags: ['festival', 'mode:in-person', 'category:single-day-event']
      })
    })
    expect(wrapper.vm.generalTags).toEqual(['festival'])
    expect(wrapper.vm.eventMode).toEqual('in-person')
    expect(wrapper.vm.eventCategory).toEqual('single-day-event')
    // another case where it can't find the input, so setting things manually
    wrapper.vm.generalTags = ['convention']
    expect(wrapper.vm.generalTags).toEqual(['convention'])
    expect(wrapper.vm.calendar_event.tags).toEqual(expect.arrayContaining(['convention', 'mode:in-person', 'category:single-day-event']))
  })

  it('sets reviewed_by_org based on prop', async () => {
    const partner = 'wrfl'

    const apiPost = wrapper.vm.$apiService.post = jest.fn((route, body) => Promise.resolve({}))
    wrapper.vm.$apiService.uploadEventImage = jest.fn().mockResolvedValue(
      { data: { imagePath: 'image.jpg' } }
    )

    // unset when prop is null
    await wrapper.vm.UploadEvent()
    expect(apiPost.mock.calls.length).toBe(1)
    expect(apiPost.mock.calls[0][1].reviewed_by_org).toBeNull()

    // === prop when prop is set
    await wrapper.setProps({ reviewOrg: partner })
    await wrapper.vm.UploadEvent()
    expect(apiPost.mock.calls.length).toBe(2)
    expect(apiPost.mock.calls[1][1].reviewed_by_org).toBe(partner)
  })

  it('strips query params off Facebook links', async () => {
    const link = 'https://facebook.com/events/1234567890/'
    const apiPost = wrapper.vm.$apiService.post = jest.fn((route, body) => Promise.resolve({}))
    wrapper.vm.$apiService.uploadEventImage = jest.fn().mockResolvedValue(
      { data: { imagePath: 'image.jpg' } }
    )

    wrapper.vm.calendar_event.fb_event_link = `${link}?context={"weird":"tracking-nonsense"}`

    await wrapper.vm.UploadEvent()
    expect(apiPost.mock.calls.length).toBe(1)
    expect(apiPost.mock.calls[0][1].fb_event_link).toBe(link)
  })

  it('strips query params off Eventbrite links', async () => {
    const link = 'https://www.eventbrite.com/e/some-event-012345678910'
    const apiPost = wrapper.vm.$apiService.post = jest.fn((route, body) => Promise.resolve({}))
    wrapper.vm.$apiService.uploadEventImage = jest.fn().mockResolvedValue(
      { data: { imagePath: 'image.jpg' } }
    )

    wrapper.vm.calendar_event.eventbrite_link = `${link}?fbcid=gibberishgibberishandmoregibberish`

    await wrapper.vm.UploadEvent()
    expect(apiPost.mock.calls.length).toBe(1)
    expect(apiPost.mock.calls[0][1].eventbrite_link).toBe(link)
  })

  it('shows condition controls in edit mode', async () => {
    expect(wrapper.findComponent('.status-container').exists()).toBe(true)

    // ...but not in upload mode
    await wrapper.setProps({ user_action: 'upload' })
    expect(wrapper.findComponent('.status-container').exists()).toBe(false)
  })

  it('conditions can be changed', async () => {
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:in-person'])
    await wrapper.findComponent('.status-container input[type="checkbox"][value="postponed"]').setChecked(true)
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:in-person', 'condition:postponed'])
    await wrapper.findComponent('.status-container input[type="checkbox"][value="sold-out"]').setChecked(true)
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:in-person', 'condition:postponed', 'condition:sold-out'])
    await wrapper.findComponent('.status-container input[type="checkbox"][value="postponed"]').setChecked(false)
    expect(wrapper.vm.calendar_event.tags).toEqual(['mode:in-person', 'condition:sold-out'])
  })

  // function getFilledOutEvent() {
  //   return {
  //     'id': '',
  //     'title': 'An Event ( 1 to 2 on 12th)',
  //     'date_times': [
  //       {
  //         'optional_title': '',
  //         'start_time': '2020-01-31T18:00:00.000Z',
  //         'end_time': '2020-01-31T19:00:00.000Z'
  //       }
  //     ],
  //     'image': 'https://s3.us-east-2.amazonaws.com/test-downloader/uploads/fbde5881-7ac7-4e3f-9a8c-daa6d9ef84df.jpg',
  //     'social_image': '',
  //     'organizers': [],
  //     'admission_fee': 'none',
  //     'venue': {
  //       'name': '',
  //       'id': '',
  //       'slug': '',
  //       'createdAt': '',
  //       'updatedAt': '',
  //       'g_map_link': '',
  //       'address': ''
  //     },
  //     'brief_description': 'Brief Desc',
  //     'description': '<p>Full Desc</p>',
  //     'website_link': '',
  //     'eventbrite_link': '',
  //     'fb_event_link': '',
  //     'ticket_link': '',
  //     'organizer_contact': 'chris.wininger@gmail..com',
  //     'multi_day': false,
  //     'additional_dates': [],
  //     'venue_id': 'c2d65c4b-dee1-4449-9337-7e2de70dd1ad',
  //     'venue_name': 'Wyman, Mosciski and Wyman'
  //   }
  // }

  // function getMockVenueResponse(venueId) {
  //   return {
  //     'data': {
  //       'status': 'success',
  //       'venue': {
  //         'id': venueId,
  //         'name': 'Moore - Lakin',
  //         'slug': 'ea-in-deleniti',
  //         'address': '3290 Amya Trail',
  //         'g_map_link': 'https://caden.com',
  //         'createdAt': '2020-01-11T15:15:13.833Z',
  //         'updatedAt': '2020-01-11T15:15:13.833Z'
  //       }
  //     },
  //     'status': 200,
  //     'statusText': 'OK',
  //     'headers': {
  //       'content-type': 'application/json; charset=utf-8'
  //     },
  //     'config': {
  //       'url': 'http://localhost:3003/venues/ccafb16c-8d6d-4d7d-9a1a-c0a1256dde32',
  //       'method': 'get',
  //       'headers': {
  //         'Accept': 'application/json, text/plain, */*'
  //       },
  //       'transformRequest': [
  //         null
  //       ],
  //       'transformResponse': [
  //         null
  //       ],
  //       'timeout': 0,
  //       'xsrfCookieName': 'XSRF-TOKEN',
  //       'xsrfHeaderName': 'X-XSRF-TOKEN',
  //       'maxContentLength': -1
  //     },
  //     'request': {}
  //   }
  // }
})
