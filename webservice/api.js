const axios = require('axios');
const localConfig = require('../localConfig');

const BASE_URL_FOURSQUARE = 'https://api.foursquare.com/v2/';
const KEYS = `client_id=${localConfig.fourSquare.clientID}&client_secret=${localConfig.fourSquare.clientSecret}`;

module.exports = {
    configureAxios: (req, res, next) => {
        axios.defaults.baseURL = BASE_URL_FOURSQUARE;
        //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        next();
    },
    fetchLocations: async () => {
        const url = `venues/explore?${KEYS}&v=20180323&ll=41.6579,-0.8772&limit=300&radius=10000`;
        return axios.get(url);
    }
}
