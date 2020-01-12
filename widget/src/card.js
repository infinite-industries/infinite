import TimeService from './timeService.js'

const LENGTH_OF_CARD_DESCRIPTION = 6

export function Card (event_data){

    let processed_brief_description = event_data.brief_description.slice(0,LENGTH_OF_CARD_DESCRIPTION)+"..."
    let day = TimeService.returnDay (event_data.date_times[0].start_time)
    let month = TimeService.returnMonth (event_data.date_times[0].start_time)
    let date = TimeService.returnDate (event_data.date_times[0].start_time)
    let start_hour = TimeService.returnHourMinutesAMPM (event_data.date_times[0].start_time)
    let end_hour = TimeService.returnHourMinutesAMPM (event_data.date_times[0].end_time)


    const template = `
    <div class="infinite-card">
        <div class="infinite-image-container">
            <img src = "${event_data.image}" width="auto" height="100px" />
        </div>

        <div class="infinite-info-container">
            <h3>${event_data.title}</h3>
            <h4>
                <svg width="20px" height="20px" viewBox="0 0 3.8674 5.5" x="0px" y="0px">
                    <g :fill="iconColor"><path d="M1.9337 0.0001c1.068,0 1.9337,0.8656 1.9337,1.9336 0,0.7798 -0.7354,1.7041 -1.142,2.4084 -0.2639,0.4571 -0.5279,0.914 -0.7917,1.3711 -0.2638,-0.4571 -0.5278,-0.914 -0.7917,-1.3711 -0.4066,-0.7043 -1.142,-1.6286 -1.142,-2.4084 0,-1.068 0.8657,-1.9336 1.9337,-1.9336zm0 1.1518c0.4319,0 0.7818,0.3499 0.7818,0.7818 0,0.4319 -0.3499,0.7819 -0.7818,0.7819 -0.4319,0 -0.7818,-0.35 -0.7818,-0.7819 0,-0.4319 0.3499,-0.7818 0.7818,-0.7818z" /></g>
                </svg>
                ${event_data.venue_id}
            </h4>

            <p class="date">${day} ${month} ${date}</p>
            <p class="time">${start_hour} - ${end_hour}</p>
            <p class="description">${processed_brief_description}</p>

            <div class="btn-actions">
            <a href="https://staging.infinite.industries/events/${event_data.id}" target="_new"><button>More Info</button></a>
            </div>

        </div>
    </div>`

    return template

}
