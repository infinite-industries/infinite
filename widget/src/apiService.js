export default class APIService {

    static getEvents(context, callback) {
        APIService.get(`${context.getApiUrl()}/events/current-verified?embed=Venue`, function(err, response) {
            callback(err, response ? response.events : null)
        })
    }

    static getEvent(context, callback) {
        const eventId = context.getEventId()
        APIService.get(`${context.getApiUrl()}/events/${eventId}`, function(err, response) {
            callback(err, response ? response.event : null)
        })
    }

    static get(path, callback){
        fetch(path)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            callback(null, data)
        })
        .catch(function(err) {
            callback(err)
        });
    }
}
