import ConfigService from './configService.js'
// Import Card template and renderer
import Card from './card.js'

export default function CardsViewer(context, events_list, page_size, page_number) {

    const content = document.createElement('div')
    content.setAttribute("id", "infinite-widget-content")
    context.appendChild(content)

    const start_event = page_size*page_number
    const end_event = parseInt(start_event)+parseInt(page_size)

    events_list.slice(start_event, end_event).forEach((event)=>{
        // console.log("start: "+start_event+" end: "+end_event )
        // console.log("\n-----------\n" + JSON.stringify(event))

        content.insertAdjacentHTML('beforeend', Card(event))

        // inject the image -- this is a bit hacky, need to think through a more elegant solution
        const last_child = content.lastChild
        const image_container = last_child.querySelector(".infinite-image-container")

        image_container.innerHTML = '<a href="' + ConfigService.getSiteUrl() + '/events/' + event.id +'" target="_new"><div class="image-surface" style="width:100%;height:150px; background:url(' + event.image + ') center center / cover no-repeat;cursor:pointer;"></div></a>'

    })

    console.log(page_number)

    return content

}