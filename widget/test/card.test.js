import Card from '../src/card.js'

const test_event = {
    id:"test-id-123",
    title:"Test Card Title",
    date_times:[{
        end_time:"2020-02-21T13:00:00.000Z",
        start_time:"2020-02-20T10:01:00.000Z",
        optional_title:""
    }],
    image:"https://s3.us-east-2.amazonaws.com/test-downloader/uploads/edc98182-f352-4757-a1ee-543b1f79988f.jpg",
    social_image:"",
    venue_id:"2c7ae750-f193-4b5f-9893-fa9d56c647ba",
    brief_description:"  asdfasdfas d",
    venue: {
        name: "Test Name"
    }
}

const expected_event_url = "https://infinite.industries/events/" + test_event.id

const long_description = [
    'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,'
].join(' ')

const test_context = {
    getSiteUrl: jest.fn(() => 'https://infinite.industries')
}

test('renders a card', () => {
    expect(Card(test_context, test_event)).toContain(test_event.title)
    expect(Card(test_context, test_event)).toContain(test_event.brief_description)
    expect(Card(test_context, test_event)).toContain(expected_event_url)
    expect(Card(test_context, test_event)).toContain("February")
})

test('truncates a long description', () => {
    const testRender = Card(test_context, Object.assign({}, test_event, {
        brief_description: long_description
    }))
    // does not contain the full description
    expect(testRender).not.toContain(long_description)
    // but does contain at least part of it
    expect(testRender).toContain(long_description.slice(0, 100))
})
