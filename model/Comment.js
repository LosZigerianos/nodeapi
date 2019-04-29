'use strict';

const mongoose = require('mongoose');

const commentScheme = mongoose.Schema({
    userId: { type: String, unique: true },
    locationId: { type: String, unique: true },
    description: { type: String },
    creationDate: { type: Date, default: Date.now }
});

commentScheme.index({ id: 1 });
commentScheme.index({ userId: 1 });
commentScheme.index({ locationId: 1 });
commentScheme.index({ description: 1 });

// Static method
commentScheme.statics.getComments =
function(
    filter,
    skip,
    limit,
    fields,
    sort
    ) {
    // Create query
    const query = Location.find(filter);

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields): query.select('-__v');
    query.sort(sort);
    // NOTE: First execute sort and (skip and limit) late

    // Execute query and return promise
    return query.exec();
};

// Create the model
const Comment = mongoose.model('Location', commentScheme);

module.exports = Comment;