
export default class APIService {

    static get(path, callback){
        console.log("Started API call")

        fetch(path)
        .then(function(response) {
          return response.json()
        })
        .then(function(data) {
          callback(data.events)
        })
        //catch error
    }
}
