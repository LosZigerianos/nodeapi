'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentScheme = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    description: { type: String },
    creationDate: { type: Date, default: Date.now }
});

commentScheme.index({
    user: 1,
    location: 1,
}, {
  name: "commentIndex"
});

// Static method
commentScheme.statics.getByLocation =
function(
    locationId,
    skip,
    limit,
    fields,
    sort
    ) {
    const filter = { location:  locationId };
    return getComments(filter, skip, limit, fields, sort);
};

commentScheme.statics.getByUser =
function(
    userId,
    skip,
    limit,
    fields,
    sort
    ) {
    const filter = { user:  userId };
    return getComments(filter, skip, limit, fields, sort);
};

commentScheme.statics.getByUsers =
function(
    userIdsArray,
    skip,
    limit,
    fields,
    sort
    ) {
    const filter = { user: { $in: userIdsArray } };
    return getComments(filter, skip, limit, fields, sort);
};

const getComments = (
    filter,
    skip,
    limit,
    fields,
    sort
    ) => {
    // Create query
    const query = Comment.find(filter);

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields): query.select('-__v');
    query.sort(sort);
    // NOTE: First execute sort and (skip and limit) late

    // Execute query and return promise
    return query.populate('location')
                .populate('user')
                .exec();
};


// Create the model
const Comment = mongoose.model('Comment', commentScheme);

module.exports = Comment;