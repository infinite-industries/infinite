// Options:
// local
// staging - https://staging-api.infinite.industries/events/current/verified/
// production - https://api.infinite.industries/events/current/verified/

// Create methods ^%$#^%$#!!!!


export function APICaller(callback){
    console.log("Started API call")

    fetch('https://staging-api.infinite.industries/events/current/verified/')
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      callback(data.events)
    })
    //catch error
}
