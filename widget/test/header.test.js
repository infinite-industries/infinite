import Header from '../src/header.js'

test('renders a header', () => {
    expect(Header("Test String")).toContain("Test String")
})
