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

        if (name) filter.name = new RegExp(name, "i");
        // new RegExp('^' + name, "i"); // comienza por

        if (city) filter.city = city;

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
        const city = req.params.city;
        const skip = req.query.skip; // DDBB
        const limit = req.query.limit; // DDBB
        const fields = req.query.fields; // DDBB
        const sort = req.query.sort; // DDBB
        const filter = {}; // DDBB

        if (city) filter.city = new RegExp(city, "i");

        const locations = await Location.getAll(
            filter,
            skip,
            limit,
            fields,
            sort
        );

        if (locations.length > 0) {
            res.json({ success: true, data: locations });
        } else {
            console.log('Llamar a la API');
            const response = await api.fetchLocationsByCity(city, limit);
            for (const place of response.data.response.venues) {
                const newLocation = new Location(place);
                newLocation.description = "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, cras eros tempor dictumst nostra aptent conubia, a mus habitant libero augue convallis faucibus."
                newLocation.coordinates.latitude = place.location.lat;
                newLocation.coordinates.longitude = place.location.lng;
                newLocation.address = place.location.address;
                newLocation.postalCode = place.location.postalCode;
                newLocation.cc = place.location.cc;
                newLocation.city = place.location.city;
                newLocation.state = place.location.state;
                newLocation.country = place.location.country;
                newLocation.formattedAddress = place.location.formattedAddress.join(', ');
                newLocation.tags = place.categories.map( (currentCategory, index, array) => currentCategory.name );
                newLocation.comments = [];
                if (newLocation.rating.totalVotes > 0 && newLocation.rating.totalValues > 0) {
                    newLocation.rating.value = newLocation.rating.totalValues / newLocation.rating.totalVotes;
                } else {
                    newLocation.rating.value = 0;
                }
    
                newLocation.photos = [];
                console.log('Guardando localizacion: ', newLocation.name);
                
                await newLocation.save();
            }
            //const locations = parseArrayFourSquareToLocations(response.data.response.venues);
            const locations = await Location.getAll(
                filter,
                skip,
                limit,
                fields,
                sort
            );

            res.json({ success: true, data: locations });
        }
    } catch (error) {
        console.error(error);
    }
});

/**
 * GET /locations
 * Return a places list from city.
 */
router.get('/:city/:name', async (req, res, next) => {
    try {
        const city = req.params.city;
        const name = req.params.name;
        const skip = req.query.skip;
        const limit = req.query.limit;
        const fields = req.query.fields;
        const sort = req.query.sort;
        const filter = {};

        if (city) filter.city = new RegExp(city, "i");
        if (name) filter.name = new RegExp(name, "i");

        const locations = await Location.getAll(
            filter,
            skip,
            limit,
            fields,
            sort
        );

        if (locations.length > 0) {
            res.json({ success: true, data: locations });
        } else {
            console.log('Llamar a la API');
            const response = await api.fetchLocationsByName(city, name, limit);
            for (const place of response.data.response.venues) {
                const newLocation = new Location(place);
                newLocation.description = "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, cras eros tempor dictumst nostra aptent conubia, a mus habitant libero augue convallis faucibus."
                newLocation.coordinates.latitude = place.location.lat;
                newLocation.coordinates.longitude = place.location.lng;
                newLocation.address = place.location.address;
                newLocation.postalCode = place.location.postalCode;
                newLocation.cc = place.location.cc;
                newLocation.city = place.location.city;
                newLocation.state = place.location.state;
                newLocation.country = place.location.country;
                newLocation.formattedAddress = place.location.formattedAddress.join(', ');
                newLocation.tags = place.categories.map( (currentCategory, index, array) => currentCategory.name );
                newLocation.comments = [];
                if (newLocation.rating.totalVotes > 0 && newLocation.rating.totalValues > 0) {
                    newLocation.rating.value = newLocation.rating.totalValues / newLocation.rating.totalVotes;
                } else {
                    newLocation.rating.value = 0;
                }
    
                newLocation.photos = [];
                console.log('Guardando localizacion: ', newLocation.name);
                
                await newLocation.save();
            }
            //const locations = parseArrayFourSquareToLocations(response.data.response.venues);
            const locations = await Location.getAll(
                filter,
                skip,
                limit,
                fields,
                sort
            );

            res.json({ success: true, data: locations });
        }
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

const parseArrayFourSquareToLocations = async arrPlaces => {
    let locations = [];
    for (const place of arrPlaces) {
        const newLocation = new Location();
        newLocation.id = place.id;
        newLocation.name = place.name;
        newLocation.description = "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, cras eros tempor dictumst nostra aptent conubia, a mus habitant libero augue convallis faucibus."
        
        newLocation.coordinates.latitude = place.location.lat;
        newLocation.coordinates.longitude = place.location.lng;
        
        newLocation.address = place.location.address;
        newLocation.postalCode = place.location.postalCode;
        newLocation.cc = place.location.cc;
        newLocation.city = place.location.city;
        newLocation.state = place.location.state;
        newLocation.country = place.location.country;
        newLocation.formattedAddress = place.location.formattedAddress.join(', ');

        newLocation.photos = [];
        //const photos = await getPhotosFromFourSquareLocations(newLocation.id);
        console.log('photos: ', photos.data.response.photos.items);

        newLocation.tags = place.categories.map( (currentCategory, index, array) => currentCategory.name );
        newLocation.comments = [];
        
        locations.push(newLocation);
    }

    return locations;
}

// TODO: CONTINUAR CON LA FUNCION
const getPhotosFromFourSquareLocations = async id => {
    try {
        //const result = await api.fetchPhotosByLocationId(id);
        //const items = result.data.response.photos.items;

        let arrPhotos = [];
        for (const item of items) {
            if (item.visibility.toLowerCase() === 'public'.toLowerCase()) {
                const url = `${item.prefix}${item.width}x${item.height}${item.suffix}`;
                arrPhotos.push(url);
            }
        }

        return arrPhotos;
    } catch(err) {
        console.log('Error: ', err);
        return null;
    }
}

module.exports = router;
