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
}


test('renders a card', () => {
    expect(Card(test_event)).toContain(test_event.title)
    expect(Card(test_event)).toContain(test_event.brief_description)
    expect(Card(test_event)).toContain(test_event.id)
    expect(Card(test_event)).toContain("February")
    // expect(Card(test_event)).toContain(test_event.title)
})
