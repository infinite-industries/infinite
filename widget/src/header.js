import ConfigService from './configService.js'

export default function Header (){

    const widget_title = ConfigService.getWidgetTitle()
    if(widget_title === null){ widget_title = ""}

    const template = `
        <div id="infinite-header">
            <h2 style="color:white">${widget_title}</h2>
            <div id="branding">
                <a href="${ConfigService.getSiteUrl()}" target="_new">
                    powered by Infinite Industries
                </a>
            </div>
        </div>
    `

    return template
}
