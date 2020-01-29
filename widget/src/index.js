// Infinite Industries Widget

const PATH = 'events/current/verified?embed=venue'
const CARD_FOOTPRINT = 300

// Import API helper
import APIService from './apiService.js'
import ConfigService from './configService.js'
import RenderCardsViewer from './cardsViewer.js'
import Header from './header.js'
import Loader from './loader.js'

const HighlightNumber = function(page_number){
    const number_list = document.querySelectorAll('.infinite-cards-page-number')
    number_list.forEach(function(node){
        node.setAttribute("style", "border: 0px;")
    })
    number_list[page_number].setAttribute("style", "border: 1px solid white;")
}

const ResizeCardViewer = function(cards_per_page){
    const ideal_row_width = cards_per_page*CARD_FOOTPRINT

    if(window.innerWidth > ideal_row_width+100){
        document.querySelector("#infinite-card-viewer-container").style.width = ideal_row_width + "px"
    }
    else {
        console.log(window.innerWidth)
        if(window.innerWidth < CARD_FOOTPRINT * 1.5){
            document.querySelector("#infinite-card-viewer-container").style.width = "100px"
            console.log("on phone")
        }
        else{
            document.querySelector("#infinite-card-viewer-container").style.width = window.innerWidth-100 + "px"
        }
    }
}

window.onresize = function(){
    ResizeCardViewer(ConfigService.getPageSize())
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("begin injecting widget content")
    const infinite_widget_container = ConfigService.getContainer()

    if(infinite_widget_container !== null){

        const title = ConfigService.getWidgetTitle()

        if (title !== null) {
            infinite_widget_container.innerHTML = Header(title)
        }
        else {
            infinite_widget_container.innerHTML = Header()
        }

        const cards_per_page = ConfigService.getPageSize()
        let which_page = 0

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

                ResizeCardViewer(cards_per_page)

                let cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)

                if((events.length - cards_per_page)>=0){

                    const pagination = document.createElement('div')
                    pagination.setAttribute("id", "infinite-widget-pagination")

                    const previous = document.createElement('span')
                    previous.setAttribute("id", "infinite-cards-previous")
                    previous.innerText = "previous"
                    pagination.appendChild(previous)
                    previous.addEventListener("click", function(){
                        which_page--
                        if(which_page<0){
                            which_page = 0
                        }
                        cards_viewer.remove()
                        cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)
                        HighlightNumber(which_page)
                    })

                    const total_number_of_pages = Math.ceil(events.length/cards_per_page)

                    for (let count=0; count < total_number_of_pages; count++){

                        const page_number = document.createElement('span')
                        page_number.setAttribute("class", "infinite-cards-page-number")
                        page_number.innerText = count+1         // humans don't like page 0
                        pagination.appendChild(page_number)

                        page_number.addEventListener("click", function(){
                            cards_viewer.remove()
                            cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, count)
                            HighlightNumber(count)
                        })

                    }

                    const next = document.createElement('span')
                    next.setAttribute("id", "infinite-cards-next")
                    next.innerText = "next"
                    pagination.appendChild(next)
                    next.addEventListener("click", function(){
                        which_page++
                        if(which_page >= total_number_of_pages-1){
                            which_page = total_number_of_pages-1
                        }
                        cards_viewer.remove()
                        cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)
                        HighlightNumber(which_page)
                    })

                    infinite_widget_container.appendChild(pagination)
                    HighlightNumber(0)                  //set first page as the default highlight
                }

            }
        })
    }
    else {
        console.log("Please make sure that element with id \"infinite-widget\" is present in the body of your document.")
    }
})
