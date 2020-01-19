// Import Card template and renderer
import Card from './card.js'

export default function CardsViewer(context, events_list, page_size, page_number) {

    events_list.slice(page_size*page_number, page_size*page_number+page_size).forEach((event)=>{
        console.log("\n-----------\n" + JSON.stringify(event))
        context.insertAdjacentHTML('beforeend', Card(event))

        // inject the image -- this is a bit hacky, need to think through a more elegant solution
        const last_child = context.lastChild
        const image_container = last_child.querySelector(".infinite-image-container")

        image_container.innerHTML = '<a href="' + SITE_URL + '/events/' + event.id +'" target="_new"><div class="image-surface" style="width:100%;height:150px; background:url(' + event.image + ') center center / cover no-repeat;cursor:pointer;"></div></a>'

    })

}
