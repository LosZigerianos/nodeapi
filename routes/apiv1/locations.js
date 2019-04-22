const express = require('express');
const router = express.Router();

const Location = require('../../model/Location');

const jwtAuth = require('../../lib/jwtAuth');

/**
 * GET /locations
 * Return a locations list.
 */
router.get('/', jwtAuth(), async (req, res, next) => {
    try {
        const name = req.query.name;
        const city = req.query.city;

        const skip = req.query.skip;
        const limit = req.query.limit;

        const fields = req.query.fields;
        const sort = req.query.sort;

        const filter = {};

        if (name) {
            filter.name = name;
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
 * POST /locations
 * Create location
 */
router.post('/', async (req, res, next) => {
    console.log('req.body: ', req.body);
    // Create location in memory
    const location = new Location(req.body);

    // Save in database
    // 1 - Callback
    /*location.save((err, locationStored) => {
        if (err) {
            next(err);
            return;
        }

        res.json({ success: true, data: locationStored });
    });*/

    // 2 - Promesa
    /*location.save().then(locationStored => {
        res.json({ success: true, data: locationStored });
    }).catch(next);*/

    // 3 - Async / Await
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

module.exports = router;
