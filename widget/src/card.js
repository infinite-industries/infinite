export function Card (event_data){
    const template = `
    <div class="card-container">
        <div class="card-image">

        </div>

        <div id="title-content" class="card-title">
            ${event_data.title}
        </div>

        <div id="text-content" class="card-text">

        </div>

        <div class="card-button-box">
            <span class="infinite-card-button">activate</span>
        </div>
    </div>`

    return template

}
