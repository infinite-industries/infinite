
export default function Header (widget_title, site_url){

    const template = `
        <div id="infinite-header">
            <h2 style="color:white">${widget_title}</h2>
            <div id="branding">
                <a href="${site_url}" target="_new">
                    powered by Infinite Industries
                </a>
            </div>
        </div>
    `

    return template
}
