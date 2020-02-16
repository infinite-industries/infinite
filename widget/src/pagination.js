import ConfigService from './configService.js'
import RenderCardsViewer from './cardsViewer.js'

const infinite_widget_container = ConfigService.getContainer()
const cards_per_page = ConfigService.getPageSize()
let which_page = 0

const PAGES_WINDOW = 8

const HighlightNumber = function(page_number, total_number_of_pages){
    if(window.innerWidth>768){
        const number_list = document.querySelectorAll('.infinite-cards-page-number')
        number_list.forEach(function(node){
            node.setAttribute("style", "border: 0px;")
        })
        number_list[page_number].setAttribute("style", "border: 1px solid white;")
    }
}

export default function Pagination (cards_viewer_container, events, cards_viewer){

    const total_number_of_pages = Math.ceil(events.length/cards_per_page)

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
        HighlightNumber(which_page, total_number_of_pages)
    })

    if(window.innerWidth>768){

        for (let count=0; count < total_number_of_pages; count++){
            const page_number = document.createElement('span')
            page_number.setAttribute("class", "infinite-cards-page-number")
            page_number.setAttribute("data-page-number", count)
            page_number.innerText = count+1         // humans don't like page 0
            pagination.appendChild(page_number)

            page_number.addEventListener("click", function(){
                cards_viewer.remove()
                which_page = count
                cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)
                HighlightNumber(count, total_number_of_pages)
            })
        }
    }
    else{
        const page_number_dropdown = document.createElement('select')
        page_number_dropdown.setAttribute("class", "infinite-mobile-cards-page-number")
        pagination.appendChild(page_number_dropdown)

        for (let count=0; count < total_number_of_pages; count++){
            let page_name = "page " + (count+1)
            page_number_dropdown.options[count] = new Option(page_name, count);

        }


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
        HighlightNumber(which_page, total_number_of_pages)
    })

    infinite_widget_container.appendChild(pagination)
    HighlightNumber(0, total_number_of_pages)                  //set first page as the default highlight
}
