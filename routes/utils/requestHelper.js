const axios = require('axios');
module.exports = {
    makeAPICall (verb, path,apiKey, complete) {
        let url = process.env.API_URL + '/' + path;

        if (apiKey && verb === 'get')
            url += '?apikey=' + apiKey;

        console.info('requesting data from: ' + url);

        // general event listings for the user's area
        axios[verb](url)
            .then(function(response){
                console.info('success: ' + url);
                complete(null, response);
            })
            .catch(function (error) {
               complete(error);
            });
    }
};