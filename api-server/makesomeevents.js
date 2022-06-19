/**
 * To use:
 * - Stand up a database (you can use the instructions in ADMIN_NOTES.md
 *   to stand up a Docker container)
 * - In api-server, run npm run db:migrate but WITHOUT the mode-and-category
 *   migration (or, roll it back with npm run db:migrate:down-one)
 * - run npm run db:seed:venues to create some venues
 * - run node makesomeevents.js
 */

const axios = require('axios')

const EVENT_EMAIL = 'me@me.me'

const events = [
  // simple single-instance event -> mode:in-person, category:single-day-event
  {
    title: 'Single-day Legacy Live Event',
    date_times: [
      {
        start_time: '2022-07-02T00:00:00.000Z',
        end_time: '2022-07-02T01:00:00.000Z'
      }
    ],
    image: 'https://via.placeholder.com/1024X512/FFFF99.jpg',
    social_image: '',
    admission_fee: 'none',
    venue_id: '23A5F1E7-F300-49C1-8FA1-E060967C8C00',
    brief_description: 'Live single-day event with no tags to start with',
    description: '',
    website_link: 'https://example.com/',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: EVENT_EMAIL,
    tags: []
  },

  // simple multi-instance event -> mode:in-person, category:multi-day-event
  {
    title: 'Multi-day Legacy Live Event',
    date_times: [
      {
        start_time: '2022-07-03T00:00:00.000Z',
        end_time: '2022-07-03T01:00:00.000Z'
      },
      {
        start_time: '2022-07-04T00:00:00.000Z',
        end_time: '2022-07-04T01:00:00.000Z'
      }
    ],
    image: 'https://via.placeholder.com/1024X512/9999CC.jpg',
    social_image: '',
    admission_fee: 'none',
    venue_id: '4C239868-12C0-4CF8-8CCE-D7703315615C',
    brief_description: 'Live multi-day event with no tags to start with',
    description: '',
    website_link: 'https://example.com/',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: EVENT_EMAIL,
    tags: []
  },

  // single-instance remote event -> mode:online, category:single-day-event
  {
    title: 'Single-day Legacy Remote Event',
    date_times: [
      {
        start_time: '2022-07-06T00:00:00.000Z',
        end_time: '2022-07-06T01:00:00.000Z'
      }
    ],
    image: 'https://via.placeholder.com/1024X512/6688CC.jpg',
    social_image: '',
    admission_fee: 'none',
    venue_id: '523ABDA1-EBB6-4180-987C-7EC72902B0CA',
    brief_description: 'Remote single-day event',
    description: '',
    website_link: 'https://example.com/',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: EVENT_EMAIL,
    tags: ['remote']
  },

  // multi-instance remote event -> mode:online, category:multi-day-event
  {
    title: 'Multi-day Legacy Remote Event',
    date_times: [
      {
        start_time: '2022-07-08T00:00:00.000Z',
        end_time: '2022-07-08T01:00:00.000Z'
      },
      {
        start_time: '2022-07-09T01:00:00.000Z',
        end_time: '2022-07-09T02:00:00.000Z'
      },
      {
        start_time: '2022-07-10T00:00:00.000Z',
        end_time: '2022-07-10T01:00:00.000Z'
      }

    ],
    image: 'https://via.placeholder.com/1024X512/CCDDFF.jpg',
    social_image: '',
    admission_fee: 'none',
    venue_id: '6D8BCE3F-03D8-49FA-B3D9-F75C9C5D4AF6',
    brief_description: 'Remote multi-day event',
    description: '',
    website_link: 'https://example.com/',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: EVENT_EMAIL,
    tags: ['remote']
  },

  // event with 'gallery' tag -> mode:in-person, category:gallery-show
  {
    title: 'Live Gallery Event',
    date_times: [
      {
        start_time: '2022-07-12T15:00:00.000Z',
        end_time: '2022-07-12T21:00:00.000Z'
      },
      {
        start_time: '2022-07-30T15:00:00.000Z',
        end_time: '2022-07-30T21:00:00.000Z'
      }

    ],
    image: 'https://via.placeholder.com/1024X512/FFCC66.jpg',
    social_image: '',
    admission_fee: 'none',
    venue_id: '8AC3221A-31D7-47CF-ABA0-D29F315E0379',
    brief_description: 'Live gallery show',
    description: '',
    website_link: 'https://example.com/',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: EVENT_EMAIL,
    tags: ['gallery']
  },

  // remote event with 'gallery' tag -> mode:online, category:gallery-show
  {
    title: 'Remote Gallery Event',
    date_times: [
      {
        start_time: '2022-07-02T15:00:00.000Z',
        end_time: '2022-07-02T21:00:00.000Z'
      },
      {
        start_time: '2022-07-30T15:00:00.000Z',
        end_time: '2022-07-30T21:00:00.000Z'
      }

    ],
    image: 'https://via.placeholder.com/1024X512/9999FF.jpg',
    social_image: '',
    admission_fee: 'none',
    venue_id: 'CFFA9C51-BCAC-427D-81CC-EFA4C4CF7146',
    brief_description: 'Remote gallery show',
    description: '',
    website_link: 'https://example.com/',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: EVENT_EMAIL,
    tags: ['gallery', 'remote']
  },

  // online resource -> mode:online, category:online-resource
  {
    title: 'Online Resource',
    date_times: [],
    image: 'https://via.placeholder.com/1024X512/4455BB.jpg',
    social_image: '',
    admission_fee: 'none',
    venue_id: 'D6A8C4DB-FE5B-4966-AB89-8482289CAE97',
    brief_description: 'Online Resource',
    description: '',
    website_link: 'https://example.com/',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: EVENT_EMAIL,
    tags: ['online-resource']
  }
]

axios.get('http://localhost:3003/v1/venues').then(({ data }) => {
  for (let i = 0; i < events.length; ++i) {
    events[i].venue_id = data.venues[i].id
  }

  return Promise.all(events.map((event) => {
    return axios.post('http://localhost:3003/v1/events', event)
  }))
})
