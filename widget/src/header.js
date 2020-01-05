
// Jest doesn't use the webpack config so SITE_URL doesn't get defined during tests
const POWERED_BY_URL = typeof SITE_URL !== 'undefined' ? SITE_URL : 'https://staging.infinite.industries'

export default function Header (event_title){

    if(event_title === null){ event_title = ""}

    const template = `
        <div id="infinite-header">
            <h2 style="color:white">${event_title}</h2>
            <div id="branding">
                <a href="${POWERED_BY_URL}" target="_new">
                    powered by Infinite Industries
                </a>
            </div>
        </div>
    `

    return template
}
