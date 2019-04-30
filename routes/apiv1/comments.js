const express = require('express');
const router = express.Router();

const Comment = require('../../model/Comment');

const jwtAuth = require('../../lib/jwtAuth');
const i18n = require('../../lib/i18n');

/**
 * GET /:locationId
 * Return a comments list by location id.
 */
router.get('/:locationId', async (req, res, next) => {
    i18n.checkLanguage(req);

    const {
        fields, sort, limit, skip
    } = req.query;

    const locationId = req.params.locationId;
   
    if (!locationId) {
        const err = new Error(i18n.__('pagina no encontrada '));
        err.status = 404;
        next(err);
        return;
    }

    try {
        const comments = await Comment.getByLocation(locationId, skip, limit, fields, sort);

        res.json({ success: true, results: comments });                                    
    }catch (err) {
        next(err);
        return;
    }
});

/**
 * GET /:userId
 * Return a comments list by location id.
 */
router.get('/:userId', async (req, res, next) => {
    i18n.checkLanguage(req);

    const {
        fields, sort, limit, skip
    } = req.query;

    const userId = req.params.userId;
   
    if (!userId) {
        const err = new Error(i18n.__('pagina no encontrada '));
        err.status = 404;
        next(err);
        return;
    }

    try {
        const comments = await Comment.getByUser(userId, skip, limit, fields, sort);

        res.json({ success: true, results: comments });                                    
    }catch (err) {
        next(err);
        return;
    }
});

module.exports = router;
