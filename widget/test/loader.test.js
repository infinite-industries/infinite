import Loader from '../src/loader.js'

test('renders a loader', () => {
    expect(Loader()).toContain("<div id=\"infinite-loader\"></div>")
})
