// Infinite Industries Widget

const PATH = `${API_URL}/events/current/verified?embed=venue`

// Import API helper
import APIService from './apiService.js'
import CardsViewer from './cardsViewer.js'
import Header from './header.js'
import Loader from './loader.js'

document.addEventListener("DOMContentLoaded", () => {
    console.log("begin injecting widget content")
    const infinite_widget_container = document.querySelector('#infinite-widget')

    if(infinite_widget_container !== null){

        const title = infinite_widget_container.getAttribute("data-widget-title")

        if (title !== null) {
            infinite_widget_container.innerHTML = Header(title)
        }
        else {
            infinite_widget_container.innerHTML = Header()
        }

        const cards_per_page = infinite_widget_container.getAttribute("data-cards-per-page")
        let which_page = 0

        // spinny thingy while loading
        const loader = document.createElement('div')
        loader.innerHTML = Loader()
        infinite_widget_container.appendChild(loader)

        console.log("Loading widget content...")

        APIService.get(PATH, (err, events) => {
            if(err){
                infinite_widget_container.innerHTML = "<h2>Unable to reach the server :(</h2> <p>For the nerds among us, the error output is in the console log.</p>"
                console.log(err)
            }
            else {
                loader.remove()
                const content = document.createElement('div')
                content.setAttribute("id", "infinite-widget-content")
                infinite_widget_container.appendChild(content)

                CardsViewer(content, events, cards_per_page, which_page)

                const pagination = document.createElement('div')
                pagination.setAttribute("id", "infinite-widget-pagination")
                infinite_widget_container.appendChild(pagination)
                pagination.innerHTML = "previous 1 | 2 | 3 next"

            }
        })
    }
    else {
        console.log("Please make sure that element with id \"infinite-widget\" is present in the body of your document.")
    }
})
