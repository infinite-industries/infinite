import Header from '../src/header.js'

test('renders a header', () => {
    const title = 'Test String'
    const url = 'https://staging.infinite.industries/'
    expect(Header(title, url)).toContain("<h2 style=\"color:white\">Test String</h2>")
})
