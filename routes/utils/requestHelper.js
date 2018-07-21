const axios = require('axios');

module.exports = {
    makeAPICall (verb, path, postBody, apiKey, userToken, complete) {
        let url = process.env.API_URL + '/' + path;
        let args = []
        if (apiKey && (verb === 'get' || verb === 'delete')) {
            console.log('applying api key to the query string')
            url += '?apikey=' + apiKey;
        } else if(apiKey) {
            console.info('applying api key to the postBody')
            postBody = postBody || {};
            postBody.apikey = apiKey;

        }

        if (userToken) {
          if (verb === 'get') {
            args = [url, { headers: {'x-access-token': userToken } }]
          } else {
            args = [url, postBody, { headers: {'x-access-token': userToken } }]
          }
        } else {
          args = [url, postBody]
        }

        console.info(`${verb}ing data from api url: "${url}"`)

        // general event listings for the user's area
        axios[verb].apply(axios, args)
            .then(response => {
                console.info(`success for url: "${url}"`);
                complete(null, response);
            })
            .catch(error => {
                console.info(`error for url "${url}": "${error+''}"`)
               complete(error.toString ? error.toString() : error);
            });
    }
};