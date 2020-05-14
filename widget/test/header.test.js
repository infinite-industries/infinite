import Header from '../src/header.js'
import ConfigService from '../src/configService.js'

jest.mock('../src/configService.js')

test('renders a header', () => {
    ConfigService.getWidgetTitle.mockReturnValue("Test String")
    ConfigService.getSiteUrl.mockReturnValue("https://example.com/")

    expect(Header()).toContain("<h2 style=\"color:white\">Test String</h2>")
})
