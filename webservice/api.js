const axios = require('axios');
const localConfig = require('../localConfig');

const BASE_URL_FOURSQUARE = 'https://api.foursquare.com/v2/';
const BASE_QUERY_FOURSQUARE = `client_id=${localConfig.fourSquare.clientID}&client_secret=${localConfig.fourSquare.clientSecret}&v=${localConfig.fourSquare.v}`;

module.exports = {
    configureAxios: (req, res, next) => {
        axios.defaults.baseURL = BASE_URL_FOURSQUARE;
        //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        next();
    },
    fetchLocationsByCity: async (city, limit) => {
        const url = `venues/search?${BASE_QUERY_FOURSQUARE}&near=${city}`;
        if (limit) url.concat(limit&&`&limit=${limit}`);
        return axios.get(url);
    },
    fetchLocationsByName: async (city, place, limit) => {
        const url = `venues/search?${BASE_QUERY_FOURSQUARE}&near=${city}&query=${place}`;
        if (limit) url.concat(limit&&`&limit=${limit}`);
        return axios.get(url);
    }
}
