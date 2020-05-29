import ConfigService from './configService.js'
// Import Card template and renderer
import Card from './card.js'

export default function EventViewer(context, event) {

    const content = document.createElement('div')
    content.setAttribute("id", "infinite-widget-content")
    context.appendChild(content)

    content.innerHTML = Card(event)

    // inject the image -- this is a bit hacky, need to think through a more elegant solution
    // TODO: can we not do this within the card? And if not, can we refactor this into a component?
    const last_child = content.lastChild
    const image_container = last_child.querySelector(".infinite-image-container")

    image_container.innerHTML = '<a href="' + ConfigService.getSiteUrl() + '/events/' + event.id +'" target="_new"><div class="image-surface" style="width:100%;height:150px; background:url(' + event.image + ') center center / cover no-repeat;cursor:pointer;"></div></a>'
}
