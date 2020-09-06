// Import Card template and renderer
import Card from './card.js'
import InjectCardImage from './cardImage.js'

export default function EventViewer(context, event) {

    const container = context.getContainer()
    const content = document.createElement('div')
    content.setAttribute("id", "infinite-widget-content")
    container.appendChild(content)

    content.innerHTML = Card(context, event)

    // inject the image -- this is a bit hacky, need to think through a more elegant solution
    const last_child = content.lastChild
    InjectCardImage(last_child, event.image, context.getSiteUrl() + '/events/' + event.id)
}
