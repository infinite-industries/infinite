import ConfigService from './configService.js'

export default class APIService {

    static getEvents(callback) {
        APIService.get(`${ConfigService.getApiUrl()}/events/current/verified?embed=venue`, function(err, response) {
            callback(err, response ? response.events : null)
        })
    }

    static getEvent(eventId, callback) {
        APIService.get(`${ConfigService.getApiUrl()}/events/${eventId}`, function(err, response) {
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
