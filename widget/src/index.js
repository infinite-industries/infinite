// Infinite Industries Widget

const PATH = 'events/current/verified?embed=venue'

// Import API helper
import APIService from './apiService.js'
import ConfigService from './configService.js'
import RenderCardsViewer from './cardsViewer.js'
import RenderHeader from './header.js'
import Loader from './loader.js'
import Pagination from './pagination.js'

document.addEventListener("DOMContentLoaded", () => {
    // console.log("begin injecting widget content")
    const infinite_widget_container = ConfigService.getContainer()
    const cards_per_page = ConfigService.getPageSize()
    let which_page = 0

    if(infinite_widget_container !== null){

        infinite_widget_container.innerHTML = RenderHeader()

        // spinny thingy while loading
        const loader = document.createElement('div')
        loader.innerHTML = Loader()
        loader.style.alignContent = 'center'
        infinite_widget_container.appendChild(loader)


        console.log("Loading widget content...")

        APIService.get(`${ConfigService.getApiUrl()}/${PATH}`, (err, events) => {
            if(err){
                infinite_widget_container.innerHTML = "<h2>Unable to reach the server :(</h2> <p>For the nerds among us, the error output is in the console log.</p>"
                console.log(err)
            }
            else {
                loader.remove()

                const cards_viewer_container = document.createElement('div')
                cards_viewer_container.setAttribute("id", "infinite-card-viewer-container")
                infinite_widget_container.appendChild(cards_viewer_container)

                let cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)

                if((events.length - cards_per_page)>=0){
                    Pagination(cards_viewer_container, events, cards_viewer)
                }
            }
        })
    }
    else {
        console.log("Please make sure that element with id \"infinite-widget\" is present in the body of your document.")
    }
})
