'use strict';

const mongoose = require('mongoose');

// Definition of scheme
const locationScheme = mongoose.Schema({
    id: { type: String, unique: true },
    city: { type: String },
    name: { type: String },
    description: { type: String, default: '' },
    address: { type: String },
    postal_code: { type: String },
    cc: { type: String },
    state: { type: String },
    country: { type: String },
    formatted_address: { type: String },
    geometry: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number] }, // [longitude, latitude]
    },
    rating: {
        total_votes: { type: Number, default: 0 },
        total_values: { type: Number, default: 0 },
        value: { type: Number },
    },
    photos: { type: [String] },
    tags: { type: [String] },
    comments: { type: [String] },
});

locationScheme.index(
    {
        city: 'text',
        name: 'text',
        tags: 'text',
        id: 1,
    },
    {
        name: 'locationIndex',
    },
);

locationScheme.index({ geometry: '2dsphere' });

const tags = ['history', 'entertainment', 'motor', 'relax', 'landscape'];

locationScheme.statics.showTags = () => tags;

// Static method
locationScheme.statics.getAll = function(filter, skip, limit, fields, sort) {
    // Create query
    const query = Location.find(filter);

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);
    // NOTE: First execute sort and (skip and limit) late

    // Execute query and return promise
    return query.exec();
};

locationScheme.statics.getNearLocationsWithSearch = function(
    coordinatesObject = {},
    searchText,
    skip,
    limit,
    fields,
    sort,
) {
    const meters = coordinatesObject.meters? parseInt(coordinatesObject.meters) / 1000 : 5;

    // create query
    const query = Location.find({
        geometry: {
            $geoWithin: {
                $center: [
                    [coordinatesObject.longitude, coordinatesObject.latitude],
                    5,
                ],
            },
        },
        $text: { $search: searchText },
    });

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);

    return query.exec();
};

locationScheme.statics.getNearLocations = function(
    coordinatesObject = {},
    skip,
    limit,
    fields,
    sort,
) {
    // create query
    const query = Location.find({
        geometry: {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [coordinatesObject.longitude, coordinatesObject.latitude],
                },
                $maxDistance: parseInt(coordinatesObject.meters) || 5000,
            },
        },
    });

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);

    return query.exec();
};

locationScheme.statics.getCity = function(filter, skip, limit, fields, sort) {
    let searchText = '';
    if (filter.city) searchText = filter.city;
    if (filter.tags) {
        searchText = searchText.length === 0 ? filter.tags : `${searchText} ${filter.tags}`;
    }

    const query = Location.find({
        $text: {
            $search: searchText,
            $caseSensitive: false,
            $diacriticSensitive: false,
        },
        city: new RegExp(filter.city, 'i'),
        tags: { $in: [new RegExp(filter.tags, 'i')] },
    });

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);

    return query.exec();
};

locationScheme.statics.getPlaceByCity = function(filter, skip, limit, fields, sort) {
    let searchText = '';
    //if (filter.city) searchText = filter.city;
    //if (filter.name) { searchText = (searchText.length === 0) ? filter.name : `${searchText} ${filter.name}`; }
    if (filter.name) searchText = filter.name;

    const query = Location.find({
        $text: {
            $search: searchText,
            $caseSensitive: false,
            $diacriticSensitive: false,
        },
        city: new RegExp(filter.city, 'i'),
    });

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);

    return query.exec();
};

locationScheme.statics.getPlacesByName = function(filter, skip, limit, fields, sort) {
    let searchText = '';
    if (filter.name) searchText = filter.name;

    const query = Location.find({
        $text: {
            $search: searchText,
            $caseSensitive: false,
            $diacriticSensitive: false,
        },
        name: new RegExp(filter.name, 'i'),
    });

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);

    return query.exec();
};

locationScheme.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.__v;
        delete ret.id;
    },
});

// Create the model
const Location = mongoose.model('Location', locationScheme);

/*Location.collection.dropIndexes(function (err, results) {
    // Handle errors
    console.log('err: ', err);
    console.log('results: ', results);
});*/

module.exports = Location;
