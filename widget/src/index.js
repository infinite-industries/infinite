// Infinite Industries Widget

// Import API helper
import APIService from './apiService.js'
import ConfigService from './configService.js'
import RenderCardsViewer from './cardsViewer.js'
import RenderEventViewer from './eventViewer.js'
import RenderHeader from './header.js'
import Loader from './loader.js'
import Pagination from './pagination.js'
import ErrorMessage from './errorMessage.js'

document.addEventListener("DOMContentLoaded", () => {
    // console.log("begin injecting widget content")
    const infinite_widget_container = ConfigService.getContainer()
    const cards_per_page = ConfigService.getPageSize()
    const event_id = ConfigService.getEventId()
    let which_page = 0

    if(infinite_widget_container !== null){

        infinite_widget_container.innerHTML = RenderHeader()

        // spinny thingy while loading
        const loader = document.createElement('div')
        loader.innerHTML = Loader()
        loader.style.alignContent = 'center'
        infinite_widget_container.appendChild(loader)

        console.log("Loading widget content...")

        if (event_id) {
            // special mode: render single card
            APIService.getEvent(event_id, (err, event) => {
                if (err) {
                    infinite_widget_container.innerHTML = ErrorMessage(err)
                } else {
                    loader.remove()
                    RenderEventViewer(infinite_widget_container, event)
                }
            })
        } else {
            // render list
            APIService.getEvents((err, events) => {
                if(err){
                    infinite_widget_container.innerHTML = ErrorMessage(err)
                }
                else {
                    loader.remove()

                    const cards_viewer_container = document.createElement('div')
                    cards_viewer_container.setAttribute("id", "infinite-card-viewer-container")
                    infinite_widget_container.appendChild(cards_viewer_container)

                    let cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)

                    if((events.length - cards_per_page)>=0){
                        // window.$e0 = infinite_widget_container
                        // console.log(infinite_widget_container.innerWidth)
                        Pagination(events, function (new_page_number) {
                            cards_viewer.remove()
                            cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, new_page_number)
                        })
                    }
                }
            })
        }
    }
    else {
        console.log("Please make sure that element with id \"infinite-widget\" is present in the body of your document.")
    }
})
