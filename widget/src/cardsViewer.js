// Import Card template and renderer
import Card from './card.js'
import InjectCardImage from './cardImage.js'

export default function CardsViewer(context, container, events_list, page_size, page_number) {

    const content = document.createElement('div')
    content.setAttribute("id", "infinite-widget-content")
    container.appendChild(content)

    const start_event = page_size*page_number
    const end_event = parseInt(start_event)+parseInt(page_size)

    events_list.slice(start_event, end_event).forEach((event)=>{
        // console.log("start: "+start_event+" end: "+end_event )
        // console.log("\n-----------\n" + JSON.stringify(event))

        content.insertAdjacentHTML('beforeend', Card(context, event))

        // inject the image -- this is a bit hacky, need to think through a more elegant solution
        const last_child = content.lastChild
        InjectCardImage(last_child, event.image, context.getSiteUrl() + '/events/' + event.id)
    })

    console.log(page_number)

    return content

}
