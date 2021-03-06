const express = require('express');
const router = express.Router();

const Comment = require('../../model/Comment');
const Location = require('../../model/Location');
const User = require('../../model/User');

const jwtAuth = require('../../lib/jwtAuth');
const i18n = require('../../lib/i18n');

// Verify JWT
router.use(jwtAuth());

/**
 * GET /location/:locationId
 * Return a comments list by location id.
 */
router.get('/location/:locationId', async (req, res, next) => {
    i18n.checkLanguage(req);

    const { fields, sort, limit, skip } = req.query;

    const locationId = req.params.locationId;
    if (!locationId) {
        res.status(400).json({ success: true, error: i18n.__('param_required %s', 'location id') });
        return;
    }

    try {
        const comments = await Comment.getByLocation(locationId, skip, limit, fields, sort);

        res.json({ success: true, data: comments.data, count: comments.count });
    } catch (err) {
        next(err);
        return;
    }
});

/**
 * GET /user/:userId
 * Return a comments list by user id.
 */
router.get('/user/:userId', async (req, res, next) => {
    i18n.checkLanguage(req);

    const { fields, sort, limit, skip } = req.query;

    const userId = req.params.userId;
    if (!userId) {
        res.status(400).json({ success: true, error: i18n.__('param_required %s', 'user id') });
        return;
    }

    try {
        const comments = await Comment.getByUser(userId, skip, limit, fields, sort);

        res.json({ success: true, data: comments.data, count: comments.count });
    } catch (err) {
        next(err);
        return;
    }
});

/**
 * GET /timeline
 * Return a comments list by user'friends
 */
router.get('/userId/:userId/timeline', async (req, res, next) => {
    i18n.checkLanguage(req);

    const { fields, sort, limit, skip } = req.query;
    const { userId } = req.params;

    try {
        const user = await User.findOne({ _id: userId });

        if (!userId) {
            res.status(400).json({
                success: true,
                error: i18n.__('field_requiered %s', 'userId'),
            });
            return;
        }

        if (!user) {
            res.status(400).json({
                success: true,
                error: i18n.__('invalid_field %s', 'userId'),
            });
            return;
        }

        // get following from user
        const followingUserArray = user.following;
        // get timeline comments
        const comments = await Comment.getByUsers(followingUserArray, skip, limit, fields, sort);

        res.json({ success: true, data: comments.data, count: comments.count });
    } catch (err) {
        next(err);
        return;
    }
});

/**
 * POST /
 * Create a new comment
 */
router.post('/add', async (req, res, next) => {
    i18n.checkLanguage(req);

    try {
        // get user id from JWT
        const userId = req.user_id;

        const { description, locationId } = req.body;

        // validate if description is not undefined or empty
        if (!userId) {
            res.status(400).json({ success: true, error: i18n.__('field_requiered %s', 'userId') });
            return;
        }

        // validate if locationId is not undefined
        if (!locationId) {
            res.status(400).json({
                success: true,
                error: i18n.__('field_requiered %s', 'locationId'),
            });
            return;
        }

        // validate if location id exist
        const location = await Location.findById(locationId);
        if (!location) {
            res.status(422).json({
                success: true,
                error: i18n.__('invalid_field %s', 'locationId'),
            });
            return;
        }

        // create new comment
        const comment = await Comment.create({ user: userId, location: locationId, description });
        // get comment with user and location full data
        const commentFullData = await Comment.findById(comment.id)
            .populate('user')
            .populate('location');

        // add comment to current user
        await User.findByIdAndUpdate(userId, { $addToSet: { comments: comment.id } });

        res.json({ success: true, data: commentFullData });
    } catch (err) {
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

        // get comment with user and location full data
        const commentFullData = await Comment.findById(commentId)
            .populate('user')
            .populate('location');

        // validate if comment exist
        if (!commentFullData) {
            res.status(422).json({
                success: true,
                error: i18n.__('invalid_field %s', 'commentId'),
            });
            return;
        }

        // validate if user is comment's own
        if (commentFullData.user._id.toString() !== req.user_id) {
            res.status(401).json({ success: true, error: i18n.__('invalid_user') });
            return;
        }

        // delete comment
        await commentFullData.deleteOne();

        // delete comment from user
        await User.findByIdAndUpdate(req.user_id, { $pull: { comments: commentFullData._id } });

        res.json({ success: true, data: commentFullData });
    } catch (err) {
        next(err);
        return;
    }
});

module.exports = router;
