import ConfigService from './configService.js'
import RenderCardsViewer from './cardsViewer.js'

const infinite_widget_container = ConfigService.getContainer()
const cards_per_page = ConfigService.getPageSize()

const PAGES_WINDOW_SIZE = 5   // maximum number of page numbers appearing

const RenderEllipsis = function(){
    const ellipsis = document.createElement("span")
    ellipsis.innerText = "..."
    return ellipsis
}

const HighlightNumber = function(page_number){
    if(infinite_widget_container.clientWidth > 768){
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

const RenderStep = function(name, page) {
    const step = document.createElement('span')
    step.setAttribute("id", "infinite-cards-" + name)
    step.setAttribute("data-page-number", page)
    step.innerText = name
    return step
}

const RenderNumber = function(page_number, current_page) {
    const page = document.createElement('span')
    page.setAttribute("class", "infinite-cards-page-number")
    page.setAttribute("data-page-number", page_number)
    page.innerText = page_number + 1         // humans don't like page 0
    if (page_number === current_page) {
        // TODO: consider using DOM className API
        page.setAttribute("class", "infinite-cards-page-number current")
    }

    return page
}

const RenderDesktopControls = function(container, which_page, total_number_of_pages) {
    // Render page 1
    container.appendChild(RenderNumber(0, which_page))

    // Check if total number of pages is less then 1 + window size
    if(total_number_of_pages <= (PAGES_WINDOW_SIZE + 1)){
    // render all pages
        for (let count = 1; count < (total_number_of_pages - 1); ++count) {
            container.appendChild(RenderNumber(count, which_page))
        }
        console.log("rendered all of the page numbers")
    }
    else {
        // If current page is greater then window size render ellipsis
        if(which_page > PAGES_WINDOW_SIZE){
            container.append(RenderEllipsis())
        }

        // Render Window
        for (let count = which_page; count < (which_page + PAGES_WINDOW_SIZE); count++){
            container.appendChild(RenderNumber(count+1, which_page))
        }

        // If current page is less then total number of pages - window size then render ellipsis
        if(which_page < total_number_of_pages){
            container.append(RenderEllipsis())
        }
    }

    // Render final page
    container.appendChild(RenderNumber(total_number_of_pages - 1, which_page))

    return container
}

const RenderMobileControls = function(container, which_page, total_number_of_pages) {
    const page_number_dropdown = document.createElement('select')
    page_number_dropdown.setAttribute("id", "infinite-mobile-cards-page-number")
    
    for (let count = 0; count < total_number_of_pages; count++){
        let page_name = "page " + (count + 1)
        page_number_dropdown.options[count] = new Option(page_name, count);
    }

    page_number_dropdown.value = which_page
    page_number_dropdown.addEventListener("change", function(event){
        const which_page = event.target.value
        // TODO: not clear what to do with this; may need to rethink some things...
    })

    container.appendChild(page_number_dropdown)

    return container
}

const UpdateCardsDisplayAndPageNumber = function(which_page, total_number_of_pages){
    const number_controls = document.createElement('div')

    // previous button
    number_controls.appendChild(RenderStep("previous", Math.max(which_page - 1, 0)))

    // desktop or mobile controls, depending on container size
    // note that this won't get resized automatically
    if(infinite_widget_container.clientWidth > 768){
        RenderDesktopControls(number_controls, which_page, total_number_of_pages)
    }
    else{
        RenderMobileControls(number_controls, which_page, total_number_of_pages)
    }

    // next button
    number_controls.appendChild(RenderStep("next", Math.min(which_page + 1, total_number_of_pages - 1)))

    return number_controls
}


export default function Pagination (events, render_client){

    const total_number_of_pages = Math.ceil(events.length/cards_per_page)
    let which_page = 0

    const pagination = document.createElement('div')
    pagination.setAttribute("id", "infinite-widget-pagination")

    pagination.addEventListener('click', function (event) {
        const new_page = event.target.getAttribute('data-page-number')
        if (new_page) {
            render_client(new_page)
            pagination.replaceChild(UpdateCardsDisplayAndPageNumber(parseInt(new_page, 10), total_number_of_pages), pagination.firstChild)
        }
    })
    pagination.addEventListener('change', function (event) {
        const new_page = event.target.value
        render_client(new_page)
        pagination.replaceChild(UpdateCardsDisplayAndPageNumber(parseInt(new_page, 10), total_number_of_pages), pagination.firstChild)
    })

    pagination.appendChild(UpdateCardsDisplayAndPageNumber(which_page, total_number_of_pages))

    infinite_widget_container.appendChild(pagination)
}
