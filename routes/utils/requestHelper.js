const axios = require('axios');
module.exports = {
    makeAPICall (verb, path, postBody, apiKey, complete) {
        let url = process.env.API_URL + '/' + path;

        if (apiKey && verb === 'get') {
            url += '?apikey=' + apiKey;
        } else {
            postBody = postBody || {};
            postBody.apikey = apiKey;
        }

        console.info('requesting data from: ' + url);

        // general event listings for the user's area
        axios[verb](url, postBody)
            .then(function(response){
                console.info('success: ' + url);
                complete(null, response);
            })
            .catch(function (error) {
               complete(error);
            });
    }
};