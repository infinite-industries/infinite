// Import API helper
import {APICaller} from './apiCaller.js'
// Import Card template and card list renderer
import {Card} from './card.js'


document.addEventListener("DOMContentLoaded", () => {
    console.log("begin rendering")

    APICaller((events) => {
        events.forEach((event)=>{
            console.log("\n-----------\n" + JSON.stringify(event))
            //content.insertAdjacentHTML('beforeend', Card.Render(event))
        })
    })
})
