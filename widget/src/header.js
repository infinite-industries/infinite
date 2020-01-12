
export default function Header (event_title){

    if(event_title === null){ event_title = ""}

    const template = `
        <div id="infinite-header">
            <h2 style="color:white">${event_title}</h2>
            <div id="branding">
                <a href="${SITE_URL}" target="_new">
                    powered by Infinite Industries
                </a>
            </div>
        </div>
    `

    return template
}
