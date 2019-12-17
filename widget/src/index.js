// Import API helper
import {APICaller} from './apiCaller.js'
// Import Card template and renderer
import {Card} from './card.js'

document.addEventListener("DOMContentLoaded", () => {
    console.log("begin injecting widget content")
    const infinite_widget_container = document.querySelector('#infinite-widget')

    if(infinite_widget_container !== null){
        console.log("Loading widget content...")

        const content = document.createElement('div')
        content.setAttribute("id", "infinite-widget-content")
        infinite_widget_container.innerHTML = ""
        infinite_widget_container.appendChild(content)

        APICaller((events) => {
            events.forEach((event)=>{
                console.log("\n-----------\n" + JSON.stringify(event))
                content.insertAdjacentHTML('beforeend', Card(event))
            })
        })
    }
    else {
        console.log("Please make sure that element with id \"infinite-widget\" is present in the body of your document.")
    }
})
