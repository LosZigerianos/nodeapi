'use strict';

const mongoose = require('mongoose');

// Definition of scheme
const locationScheme = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    city: { type: String },
    address: { type: String }
});

const tags = [
    'history',
    'entertainment',
    'motor',
    'relax',
    'landscape'
];

locationScheme.statics.showTags = () => tags;

// Static method
locationScheme.statics.getAll =
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
const Location = mongoose.model('Location', locationScheme);

module.exports = Location;
