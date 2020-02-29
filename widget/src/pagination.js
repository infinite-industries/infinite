import ConfigService from './configService.js'
import RenderCardsViewer from './cardsViewer.js'

const infinite_widget_container = ConfigService.getContainer()
const cards_per_page = ConfigService.getPageSize()
let which_page = 0

const PAGES_WINDOW_SIZE = 5   // maximum numper of page numbers appearing

const HighlightNumber = function(page_number){
    if(infinite_widget_container.clientWidth>768){
        const number_list = document.querySelectorAll('.infinite-cards-page-number')
        if(number_list != null){
            number_list.forEach(function(node){
                node.setAttribute("style", "border: 0px;")
            })
            number_list[page_number].setAttribute("style", "border: 1px solid white;")
        }
    }
    else {
        const number_pulldown = document.querySelector('#infinite-mobile-cards-page-number')
        number_pulldown.value = page_number
    }
}

const RenderNumber = function(page_number) {
    const page = document.createElement('span')
    page.setAttribute("class", "infinite-cards-page-number")
    page.setAttribute("data-page-number", page_number)
    page.innerText = page_number+1         // humans don't like page 0
    return page
}

const RenderDesktopNumbers = function(which_page) {
    const number_list = document.createElement('div')

    // Render page 1
    pagination.appendChild(RenderNumbers(0))
    // Check if total number of pages is less then 1 + window size
    if(total_number_of_pages <= (PAGES_WINDOW_SIZE+1)){
    // render all pages

    }
    else {
        // If current page is greater then window size render ellipsis
        if(which_page > PAGES_WINDOW_SIZE){
            pagination.append(createElement("span").innerText("..."))
        }



    }



        // Render Window

        // If current page is less then total number of pages - window size then render ellipsis

        // Render final page
        pagination.appendChild(RenderNumber(total_number_of_pages-1))

    const page_number_list = pagination.querySelectorAll('.infinite-cards-page-number')
    console.log(page_number_list)
    page_number_list.forEach(function(page){
        console.log("updating: " + page.getAttribute("data-page-number"))
        page.addEventListener("click", function(){
            cards_viewer.remove()
            which_page = page.getAttribute("data-page-number")
            cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)
            HighlightNumber(which_page)
            console.log("page " + which_page)
        })
    })

    return number_list
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
        HighlightNumber(which_page)
    })

    if(infinite_widget_container.clientWidth>768){
        pagination.appendChild(RenderDesktopNumbers(which_page))
    }
    else{
    // render pagination for phones

        const page_number_dropdown = document.createElement('select')
        page_number_dropdown.setAttribute("id", "infinite-mobile-cards-page-number")
        pagination.appendChild(page_number_dropdown)

        for (let count=0; count < total_number_of_pages; count++){
            let page_name = "page " + (count+1)
            page_number_dropdown.options[count] = new Option(page_name, count);
        }

        page_number_dropdown.addEventListener("change", function(data){
            // console.log(data.target.value)
            cards_viewer.remove()
            which_page = data.target.value
            cards_viewer = RenderCardsViewer(cards_viewer_container, events, cards_per_page, which_page)
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
