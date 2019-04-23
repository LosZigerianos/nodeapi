const express = require('express');
const router = express.Router();

const Location = require('../../model/Location');

const jwtAuth = require('../../lib/jwtAuth');
const i18n = require('../../lib/i18n');

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

module.exports = router;
