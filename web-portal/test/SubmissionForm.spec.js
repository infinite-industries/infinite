import Vuex from 'vuex'
import Vuetify from 'vuetify'
// import moment from 'moment'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import SubmissionForm from '../components/SubmissionForm'
import { getEmptyCalendarEvent } from '../services/ResourceTemplateService'

// import { ApiService } from '@/services/ApiService'

jest.mock('@/services/ApiService')

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
      }
    })
  })

  // just to make the runner stop screaming
  it('exists', function () {
    expect(wrapper).toBeTruthy()
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
  //     'address': '05817 Green Prairie',
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
