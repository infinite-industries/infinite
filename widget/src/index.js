// Infinite Industries Widget

// Import API helper
import APIService from './apiService.js'
import Context from './context.js'
import RenderCardsViewer from './cardsViewer.js'
import RenderEventViewer from './eventViewer.js'
import RenderHeader from './header.js'
import Loader from './loader.js'
import Pagination from './pagination.js'
import ErrorMessage from './errorMessage.js'

document.addEventListener("DOMContentLoaded", () => {
    // console.log("begin injecting widget content")
    let which_page = 0

    const elements = document.querySelectorAll('#infinite-widget')

    if (elements.length > 0) {
        elements.forEach(function (element) {
            const context = new Context(element)
            element.innerHTML = RenderHeader(context.getTitle(), context.getSiteUrl())

            // spinny thingy while loading
            const loader = document.createElement('div')
            loader.innerHTML = Loader()
            loader.style.alignContent = 'center'
            element.appendChild(loader)

            console.log("Loading widget content...")

            if (context.getEventId()) {
                // special mode: render single card
                APIService.getEvent(context, (err, event) => {
                    if (err) {
                        element.innerHTML = ErrorMessage(err)
                    } else {
                        loader.remove()
                        RenderEventViewer(context, event)
                    }
                })
            } else {
                // render list
                const cards_per_page = context.getPageSize()
                APIService.getEvents(context, (err, events) => {
                    if(err){
                        element.innerHTML = ErrorMessage(err)
                    }
                    else {
                        loader.remove()
    
                        const cards_viewer_container = document.createElement('div')
                        cards_viewer_container.setAttribute("id", "infinite-card-viewer-container")
                        element.appendChild(cards_viewer_container)
    
                        let cards_viewer = RenderCardsViewer(context, cards_viewer_container, events, cards_per_page, which_page)
    
                        if((events.length - cards_per_page)>=0){
                            Pagination(context, events, function (new_page_number) {
                                cards_viewer.remove()
                                cards_viewer = RenderCardsViewer(context, cards_viewer_container, events, cards_per_page, new_page_number)
                            })
                        }
                    }
                })
            }
        })
    } else {
        console.log("Please make sure that element with id \"infinite-widget\" is present in the body of your document.")
    }
})
