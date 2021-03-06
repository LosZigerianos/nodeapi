'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentScheme = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    description: { type: String },
    creation_date: { type: Date, default: Date.now },
});

commentScheme.index(
    {
        user: 1,
        location: 1,
    },
    {
        name: 'commentIndex',
    },
);

// Static method
commentScheme.statics.getByLocation = async function(locationId, skip, limit, fields, sort) {
    const filter = { location: locationId };
    return await getComments(filter, skip, limit, fields, sort);
};

commentScheme.statics.getByUser = async function(userId, skip, limit, fields, sort) {
    const filter = { user: userId };
    return await getComments(filter, skip, limit, fields, sort);
};

commentScheme.statics.getByUsers = async function(userIdsArray, skip, limit, fields, sort) {
    const filter = { user: { $in: userIdsArray } };
    return await getComments(filter, skip, limit, fields, sort);
};

const getComments = async (filter, skip, limit, fields, sort = '-creation_date') => {
    // Create query
    const query = Comment.find(filter);

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);
    // NOTE: First execute sort and (skip and limit) late

    // Execute query and return promise
    const comments = await query
        .populate('location')
        .populate('user')
        .exec();

    // get comments size from database for this filter
    const commentsCount = await Comment.count(filter);

    return { data: comments, count: commentsCount };
};

commentScheme.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.__v;
    },
});

// Create the model
const Comment = mongoose.model('Comment', commentScheme);

module.exports = Comment;
