'use strict';

const mongoose = require('mongoose');

// Definition of scheme
const locationScheme = mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String },
    description: { type: String, default: '' },
    address: { type: String },
    postalCode: { type: String },
    cc: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    formattedAddress: { type: String },
    coordinates: {
        latitude: { type: String },
        longitude:  { type: String }
    },
    //rating: { type: Number },
    rating: {
        totalVotes: { type: Number, default: 0 },
        totalValues: { type: Number, default: 0 },
        value: { type: Number }
    },
    photos: { type: [String] },
    tags: { type: [String] },
    comments:  { type: [String] }
});

locationScheme.index({ id: 1 });
locationScheme.index({ name: 1 });
locationScheme.index({ city: 1 });
locationScheme.index({ state: 1 });
locationScheme.index({ country: 1 });

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
