const express = require('express');
const router = express.Router();

const Location = require('../../model/Location');
const api = require('../../webservice/api');

const jwtAuth = require('../../lib/jwtAuth');
const i18n = require('../../lib/i18n');

router.use(jwtAuth());

/**
 * GET /locations
 * Return a locations list.
 */
// router.get('/', jwtAuth(), async (req, res, next) => {
router.get('/', async (req, res, next) => {
    try {
        const name = req.query.name;
        const city = req.query.city;
        const tag = req.query.tag;

        const skip = req.query.skip;
        const limit = req.query.limit;

        const fields = req.query.fields;
        const sort = req.query.sort;

        const filter = {};

        if (name) filter.name = new RegExp(name, 'i');
        // new RegExp('^' + name, "i"); // comienza por
        if (city) filter.city = new RegExp(city, 'i');
        if (tag) filter.tags = new RegExp(tag, 'i'); //{ '$in': [ tag ] };

        const locations = await Location.getAll(filter, skip, limit, fields, sort);

        res.json({ success: true, count: locations.length, data: locations });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /city
 * Return a places list from city.
 */
router.get('/city/:city', async (req, res, next) => {
    try {
        const city = req.params.city;
        const tag = req.query.tag;
        const skip = req.query.skip;
        const limit = req.query.limit;
        const fields = req.query.fields;
        const sort = req.query.sort;
        const lang = 'en'; //req.query.lang;
        const filter = {};

        if (city) filter.city = city; //new RegExp(city, "i");
        if (tag) filter.tags = tag;

        const locations = await Location.getCity(filter, skip, limit, fields, sort);

        if (locations.length > 0) {
            res.json({ success: true, count: locations.length, data: locations });
        } else {
            const response = await api.fetchLocationsByCity(city, limit, lang);

            if (!response.data) {
                //res.json({ success: true, message: response.message });
                next(response);
                return;
            }

            _ = await _parseArrayFourSquareToLocations(response.data.response.venues);

            const locations = await Location.getCity(filter, skip, limit, fields, sort);

            res.json({ success: true, count: locations.length, data: locations });
            return;
        }
    } catch (err) {
        console.log('err :', err);
        return next(err);
    }
});

/**
 * GET /locations
 * Return a places list from city.
 */
router.get('/city/:city/place/:name', async (req, res, next) => {
    try {
        const city = req.params.city;
        const name = req.params.name;
        const skip = req.query.skip;
        const limit = req.query.limit;
        const fields = req.query.fields;
        const sort = req.query.sort;
        const lang = 'en'; //req.query.lang;
        const filter = {};

        if (city) filter.city = city; //new RegExp(city, "i");
        if (name) filter.name = name; //new RegExp(name, "i");

        const locations = await Location.getPlaceByCity(filter, skip, limit, fields, sort);

        if (locations.length > 0) {
            res.json({ success: true, count: locations.length, data: locations });
        } else {
            const response = await api.fetchLocationsByName(city, name, limit, lang);

            if (!response.data) {
                //res.json({ success: true, message: response });
                next(response);
                return;
            }

            _ = await _parseArrayFourSquareToLocations(response.data.response.venues);

            const locations = await Location.getPlaceByCity(filter, skip, limit, fields, sort);

            res.json({ success: true, count: locations.length, data: locations });
        }
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /near
 */
router.get('/near', async (req, res, next) => {
    const { fields, sort, limit, skip, latitude, longitude } = req.query;

    const meters = 5000;

    try {
        if (!latitude) {
            return res.json({ success: true, data: [] });
        }

        if (!longitude) {
            return res.json({ success: true, data: [] });
        }

        const query = { latitude, longitude, meters };

        const nearLocations = await Location.getNearLocations(query, skip, limit, fields, sort);

        res.json({ success: true, count: nearLocatios.length, data: nearLocations });
    } catch (err) {
        next(err);
        return;
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
    } catch (err) {
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

        const locationUpdated = await Location.findOneAndUpdate({ _id: _id }, data, {
            new: true,
        }).exec();
        res.json({ success: true, data: locationUpdated });
    } catch (err) {
        // Recoge todos los errores: síncronos y asíncronos
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
        const tags = await Location.showTags().map(tag => i18n.__(tag));
        res.json({ success: true, result: tags });
    } catch (err) {
        next(err);
    }
});

const _parseArrayFourSquareToLocations = async arrPlaces => {
    try {
        let locations = [];
        for (const place of arrPlaces) {
            const existing = await Location.findOne({ id: place.id });
            if (existing) return;

            const newLocation = new Location(place);
            newLocation.description =
                'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, cras eros tempor dictumst nostra aptent conubia, a mus habitant libero augue convallis faucibus.';
            newLocation.geometry.coordinates = [place.location.lng, place.location.lat]; //[longitude, latitude]
            newLocation.address = place.location.address;
            newLocation.postalCode = place.location.postalCode;
            newLocation.cc = place.location.cc;
            newLocation.city = place.location.city;
            newLocation.state = place.location.state;
            newLocation.country = place.location.country;
            newLocation.formattedAddress = place.location.formattedAddress.join(', ');
            newLocation.tags = place.categories.map(
                (currentCategory, index, array) => currentCategory.name,
            );
            newLocation.comments = [];
            if (newLocation.rating.totalVotes > 0 && newLocation.rating.totalValues > 0) {
                newLocation.rating.value =
                    newLocation.rating.totalValues / newLocation.rating.totalVotes;
            } else {
                newLocation.rating.value = 0;
            }

            newLocation.photos = [
                'https://fastly.4sqi.net/img/general/612x612/4189440_tfA12_JJyhZs7ZvV-PBLUQ1O6oGu_wvJSDMLcuZKBx4.jpg',
                'https://fastly.4sqi.net/img/general/960x720/88036_aVd3RS7aEP98snzQmhs6e_-SWtdofBAe6NilL1RY7d0.jpg',
            ]; // TODO: await _getPhotosFromFourSquareLocations(newLocation.id);
            console.log('Guardando localizacion: ', newLocation.name);

            await newLocation.save();
            locations.push(newLocation);
        }

        // TEST
        //const images = await _getPhotosFromFourSquareLocations(locations[0].id);
        //console.log('images: ', images);

        return locations;
    } catch (err) {
        console.error('Error: ', err);
        return [];
    }
};

const _getPhotosFromFourSquareLocations = async id => {
    try {
        const result = await api.fetchPhotosByLocationId(id);
        const items = result.data.response.photos.items;

        let arrPhotos = [];
        for (const item of items) {
            if (item.visibility.toLowerCase() === 'public'.toLowerCase()) {
                const url = `${item.prefix}${item.width}x${item.height}${item.suffix}`;
                arrPhotos.push(url);
            }
        }

        return arrPhotos;
    } catch (err) {
        console.error('Error: ', err);
        return [];
    }
};

module.exports = router;
