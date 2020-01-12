// Infinite Industries Widget

// Options for API servers to query:
// local
// staging - https://staging-api.infinite.industries/events/current/verified/
// production - https://api.infinite.industries/events/current/verified/

const PATH = 'https://staging-api.infinite.industries/events/current/verified?embed=venue'


// Import API helper
import APIService from './apiService.js'
// Import Card template and renderer
import Card from './card.js'
import Header from './header.js'

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


        const content = document.createElement('div')
        content.setAttribute("id", "infinite-widget-content")
        infinite_widget_container.appendChild(content)

        // spinny thingy while loading
        content.innerHTML = "<h2 style='color:white'> Loading content</h2>"

        console.log("Loading widget content...")

        APIService.get(PATH, (err, events) => {
            if(err){
                infinite_widget_container.innerHTML = "<h2>Unable to reach the server :(</h2> <p>For the nerds among us, the error output is in the console log.</p>"
                console.log(err)
            }
            else {
                content.innerHTML = ""

                events.forEach((event)=>{
                    console.log("\n-----------\n" + JSON.stringify(event))
                    content.insertAdjacentHTML('beforeend', Card(event))

                    // inject the image -- this is a bit hacky, need to think through a more elegant solution
                    const last_child = content.lastChild
                    const image_container = last_child.querySelector(".infinite-image-container")

                    image_container.innerHTML = '<a href="' + SITE_URL + '/events/' + event.id +'" target="_new"><div class="image-surface" style="width:100%;height:150px; background:url(' + event.image + ') center center / cover no-repeat;cursor:pointer;"></div></a>'

                })
            }
        })
    }
    else {
        console.log("Please make sure that element with id \"infinite-widget\" is present in the body of your document.")
    }
})
