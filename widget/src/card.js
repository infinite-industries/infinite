import TimeService from './timeService.js'

const MAX_LENGTH_OF_EVENT_TITLE = 35
const MAX_LENGTH_OF_VENUE_TITLE = 35
const MAX_LENGTH_OF_EVENT_DESCRIPTION = 120


const TitleShortener = function(full_title, max_length) {
    if(full_title.length > max_length) {
        full_title = full_title.slice(0, max_length) + "..."
    }

    return full_title
}

const VenueSection = function(event_data) {
    if (event_data.venue) {
        return `<div class="infinite-venue-container">
                <div>
                    <h4>
                        <svg width="20px" height="20px" viewBox="0 0 3.8674 5.5" x="0px" y="0px">
                            <g :fill="iconColor"><path d="M1.9337 0.0001c1.068,0 1.9337,0.8656 1.9337,1.9336 0,0.7798 -0.7354,1.7041 -1.142,2.4084 -0.2639,0.4571 -0.5279,0.914 -0.7917,1.3711 -0.2638,-0.4571 -0.5278,-0.914 -0.7917,-1.3711 -0.4066,-0.7043 -1.142,-1.6286 -1.142,-2.4084 0,-1.068 0.8657,-1.9336 1.9337,-1.9336zm0 1.1518c0.4319,0 0.7818,0.3499 0.7818,0.7818 0,0.4319 -0.3499,0.7819 -0.7818,0.7819 -0.4319,0 -0.7818,-0.35 -0.7818,-0.7819 0,-0.4319 0.3499,-0.7818 0.7818,-0.7818z" /></g>
                        </svg>
                     </h4>
                </div>
            <div class="venue-name">
                <h4>
                    ${TitleShortener(event_data.venue.name, MAX_LENGTH_OF_VENUE_TITLE)}
                </h4>
            </div>
        </div>`

    } else return ''
}

const DateTimeSection = function(event_data) {
    if (event_data.date_times && event_data.date_times.length > 0) {
        let day = TimeService.returnDay (event_data.date_times[0].start_time)
        let month = TimeService.returnMonth (event_data.date_times[0].start_time)
        let date = TimeService.returnDate (event_data.date_times[0].start_time)
        let start_hour = TimeService.returnHourMinutesAMPM (event_data.date_times[0].start_time)
        let end_hour = TimeService.returnHourMinutesAMPM (event_data.date_times[0].end_time)
        return `<div class="infinite-time-container">
                <p class="date">${day}, ${month} ${date}</p>
                <p class="time">${start_hour} - ${end_hour}</p>
            </div>`
    } else return ''
}

export default function Card (context, event_data){

    let processed_brief_description = TitleShortener(event_data.brief_description, MAX_LENGTH_OF_EVENT_DESCRIPTION)

    const template = `
    <div class="infinite-card">
        <div class="infinite-image-and-text-container">
            <div class="infinite-image-container">
                <div class="image-surface"></div>
            </div>

            <div class="infinite-title-container">
                <h3 class="infinite-card-title">${TitleShortener(event_data.title, MAX_LENGTH_OF_EVENT_TITLE)}</h3>
            </div>

            ${VenueSection(event_data)}

            ${DateTimeSection(event_data)}

            <div class="infinite-description-container">
                ${processed_brief_description}
            </div>
        </div>
        <div class="infinite-btn-actions-container">
            <div class="infinite-btn-actions">
                <a href="${context.getSiteUrl()}/events/${event_data.id}" target="_new">
                    <div id="more-info">More Info</div>
                </a>
            </div>
        </div>
    </div>`

    return template

}
