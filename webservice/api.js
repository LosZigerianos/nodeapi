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

    fetchLocationsByCity: async (city, limit, lang) => {
        const cityParam = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        let url = `venues/search?${BASE_QUERY_FOURSQUARE}&near=${cityParam}`;
        if (limit) url = url.concat(`&limit=${limit}`);
        if (lang) url = url.concat(`&locale=${lang}`);
        console.log('Request api url: ', url);
        
        try {
            return await axios.get(url);
        } catch(err) {
            console.log('Ha ocurrido un error: ', err.response.data.meta);
            const error = new Error(err.response.data.meta.errorDetail);
            error.status = err.response.data.meta.code;
            return error;
        }
    },

    fetchLocationsByName: async (city, place, limit, lang) => {
        const cityParam = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const placeParam = place.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        let url = `venues/search?${BASE_QUERY_FOURSQUARE}&near=${cityParam}&query=${placeParam}`;
        if (limit) url = url.concat(`&limit=${limit}`);
        if (lang) url = url.concat(`&locale=${lang}`);
        console.log('Request api url: ', url);

        try {
            return await axios.get(url);
        } catch(err) {
            console.log('Ha ocurrido un error: ', err.response.data.meta);
            const error = new Error(err.response.data.meta.errorDetail);
            error.status = err.response.data.meta.code;
            return error;
        }
    },

    fetchPhotosByLocationId: async (id) => {
        const url = `venues/${id}/photos?${BASE_QUERY_FOURSQUARE}`;
        console.log('Request api url: ', url);
        
        try {
            return await axios.get(url);
        } catch(err) {
            console.log('Ha ocurrido un error: ', err.response.data.meta);
            const error = new Error(err.response.data.meta.errorDetail);
            error.status = err.response.data.meta.code;
            return error;
        }
    }
}
