import Header from '../src/header.js'

test('renders a header', () => {=
    expect(Header("Test String")).toContain("<h2 style=\"color:white\">Test String</h2>")
})
