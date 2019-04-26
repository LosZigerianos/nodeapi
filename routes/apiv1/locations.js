const express = require('express');
const router = express.Router();

const Location = require('../../model/Location');
const api = require('../../webservice/api');

const jwtAuth = require('../../lib/jwtAuth');
const i18n = require('../../lib/i18n');

/**
 * GET /locations
 * Return a locations list.
 */
// router.get('/', jwtAuth(), async (req, res, next) => {
router.get('/', async (req, res, next) => {
    try {
        const name = req.query.name;
        const city = req.query.city;

        const skip = req.query.skip;
        const limit = req.query.limit;

        const fields = req.query.fields;
        const sort = req.query.sort;

        const filter = {};

        if (name) {
            filter.name = new RegExp('^' + name, "i");
        }

        if (city) {
            filter.city = city;
        }

        const locations = await Location.getAll(
            filter,
            skip,
            limit,
            fields,
            sort
        );

        res.json({ success: true, data: locations });
    } catch(err) {
        next(err);
        return;
    }
});

/**
 * GET /city
 * Return a places list from city.
 */
router.get('/:city', async (req, res, next) => {
    try {
        const limit = req.query.limit;

        const city = req.params.city;
        const response = await api.fetchLocationsByCity(city, limit);

        parseArrayFourSquareToLocations(response.data.response.venues);

        res.json({ success: true, data: response.data });
      } catch (error) {
        console.error(error);
      }
});

/**
 * GET /locations
 * Return a places list from city.
 */
router.get('/:city/:place', async (req, res, next) => {
    try {
        const limit = req.query.limit;

        const city = req.params.city;
        const place = req.params.place;
        const response = await api.fetchLocationsByName(city, place, limit);
        res.json({ success: true, data: response.data });
      } catch (error) {
        console.error(error);
      }
});

/**
 * POST /locations
 * Create location
 */
router.post('/', async (req, res, next) => {
    const location = new Location(req.body);

    try {
        const locationStored = await location.save();
        res.json({ success: true, data: locationStored });
    } catch(err) {
        next(err);
        return;
    }
});

/**
 * PUT / locations
 * Update location
 */
router.put('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        const data = req.body;

        const locationUpdated  = await Location.findOneAndUpdate({ _id: _id }, data, { new: true }).exec();
        res.json({ success: true, data: locationUpdated });
    } catch(err) { // Recoge todos los errores: síncronos y asíncronos
        next(err);
        return;
    }
});

/**
 * GET /locations
 * Return a tags list.
 */
router.get('/tags', async (req, res, next) => {
    i18n.checkLanguage(req);
    try {
        const tags = await Location.showTags().map( tag => i18n.__(tag) );
        res.json({ success: true, result: tags });
    } catch(err) {
        next(err);
    }
});

// TODO: CONTINUAR CON LA FUNCION
const parseArrayFourSquareToLocations = arrPlaces => {
        for (const place of arrPlaces) {
            const newLocation = new Location();
            newLocation.id = place.id;
            newLocation.name = place.name;
            /*newLocation.description = "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, cras eros tempor dictumst nostra aptent conubia, a mus habitant libero augue convallis faucibus."
            newLocation.address = place.vicinity;
            newLocation.coordinates.latitude = place.geometry.location.lat;
            newLocation.coordinates.longitude = place.geometry.location.lng;
            newLocation.rating = place.rating;
            newLocation.photos = [];
            newLocation.tags = place.types;
            newLocation.comments = [];*/
            console.log('newLocation: ', newLocation)
        }
}

module.exports = router;
