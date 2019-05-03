const express = require('express');
const router = express.Router();

const Comment = require('../../model/Comment');
const Location = require('../../model/Location');


const jwtAuth = require('../../lib/jwtAuth');
const i18n = require('../../lib/i18n');

// Verify JWT
router.use(jwtAuth());

/**
 * GET /:locationId
 * Return a comments list by location id.
 */
router.get('/location/:locationId', async (req, res, next) => {
    i18n.checkLanguage(req);

    const {
        fields, sort, limit, skip
    } = req.query;

    const locationId = req.params.locationId;

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
 * Return a comments list by user id.
 */
router.get('/user/:userId', async (req, res, next) => {
    i18n.checkLanguage(req);

    const {
        fields, sort, limit, skip
    } = req.query;

    const userId = req.params.userId;
   
    try {
        const comments = await Comment.getByUser(userId, skip, limit, fields, sort);

        res.json({ success: true, results: comments });                                    
    }catch (err) {
        next(err);
        return;
    }
});

/**
 * POST /
 * Create a new comment 
 */
router.post('/add' ,async (req, res, next) => {
    i18n.checkLanguage(req);    
   
    try {
        // get user id from JWT
        const userId = req.user_id;

        const { description, locationId } = req.body;

        // validate if description is not undefined or empty
        if (!description) {
            const err = new Error(i18n.__('field_requiered %s', 'description'));
            err.status = 422;
            next(err);
            return;
        }


        // validate if locationId is not undefined
        if (!locationId) {
            const err = new Error(i18n.__('field_requiered %s', 'locationId'));
            err.status = 422;
            next(err);
            return;
        }

        // validate if location id exist
        const location = await Location.findOne({ _id: locationId });
        if (!location) {
            const err = new Error(i18n.__('invalid_field %s', 'locationId'))
            err.status = 401;
            next(err);
            return;
        }
        
        // create new comment
        const comment = await Comment.create({ user: userId, location: locationId, description });

        res.json({ success: true, result: comment });                                    
    }catch (err) {
        next(err);
        return;
    }
});

/** 
 * DELETE /
 * Delete a comment
 */
router.delete('/:commentId/delete', async (req, res, next) => {
    i18n.checkLanguage(req);  
    
    try {
        const { commentId } = req.params;

        const comment = await Comment.findOne({ _id:  commentId});

        // validate if comment exist
        if (!comment) {
            const err = new Error(i18n.__('invalid_field %s', 'comment id'));
            err.status = 422;
            next(err);
            return;
        }

        // validate if user is comment's own
        if (comment.user.toString() !== req.user_id) {
            const err = new Error(i18n.__('invalid_user'));
            err.status = 422;
            next(err);
            return;
        }

        // delete comment
        await comment.deleteOne();

        res.json({ success: true, result: comment });
    }catch(err) {
        next(err);
        return;
    }

});

module.exports = router;
