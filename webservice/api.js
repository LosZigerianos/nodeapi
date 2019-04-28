const axios = require('axios');
const localConfig = require('../localConfig');

const BASE_URL_FOURSQUARE = 'https://api.foursquare.com/v2/';
const BASE_URL_FOURSQUARE_PHOTOS = 'https://igx.4sqi.net/img/general/';
const BASE_QUERY_FOURSQUARE = `client_id=${localConfig.fourSquare.clientID}&client_secret=${localConfig.fourSquare.clientSecret}&v=${localConfig.fourSquare.v}`;

module.exports = {
    configureAxios: (req, res, next) => {
        axios.defaults.baseURL = BASE_URL_FOURSQUARE;
        //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        next();
    },

    fetchLocationsByCity: async (city, limit, offset) => {
        // TODO: REPASAR EL TEMA Ñ
        const url = `venues/search?${BASE_QUERY_FOURSQUARE}&near=${city.replace('ñ','n').toLowerCase()}`;
        if (limit) url.concat(`&limit=${limit}`);
        return axios.get(url);
    },

    fetchLocationsByName: async (city, place, limit, offset) => {
        // TODO: REPASAR EL TEMA Ñ
        const url = `venues/search?${BASE_QUERY_FOURSQUARE}&near=${city.replace('ñ','n').toLowerCase()}&query=${place.replace('ñ','n').toLowerCase()}`;
        if (limit) url.concat(`&limit=${limit}`);
        return axios.get(url);
    },

    fetchPhotosByLocationId: async (id) => {
        const url = `venues/${id}/photos?${BASE_QUERY_FOURSQUARE}`;
        return axios.get(url);
    }
}
