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

locationScheme.statics.getNearLocationsWithSearch = async function(
    coordinatesObject = {},
    searchText,
    skip,
    limit,
    fields = '-__v',
    sort,
) {
    const meters = coordinatesObject.meters ? parseInt(coordinatesObject.meters) / 1000 : 5;

    // create query nearsphere with search
    const queryNearSphereWithSearch = {
        geometry: {
            $geoWithin: {
                $center: [[coordinatesObject.longitude, coordinatesObject.latitude], 2.5],
            },
        },
        $text: { $search: searchText },
    };

    // query with filters
    const queryLocation = Location.find(queryNearSphereWithSearch);
    queryLocation.skip(parseInt(skip));
    queryLocation.limit(parseInt(limit));
    queryLocation.select(fields);
    queryLocation.sort(sort);

    // Get locations results
    const locations = await queryLocation.exec();

    // Get locations count results from total database
    const total = await Location.count(queryNearSphere);

    return { data: locations, count: total };
};

locationScheme.statics.getNearLocations = async function(
    coordinatesObject = {},
    skip,
    limit,
    fields = '-__v',
    sort,
) {
    // create query
    const queryNearSphere = {
        geometry: {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [coordinatesObject.longitude, coordinatesObject.latitude],
                },
                $maxDistance: parseInt(coordinatesObject.meters) || 5000,
            },
        },
    };

    // query with filters
    const queryLocation = Location.find(queryNearSphere);
    queryLocation.skip(parseInt(skip));
    queryLocation.limit(parseInt(limit));
    queryLocation.select(fields);
    queryLocation.sort(sort);

    // Get locations results
    const locations = await queryLocation.exec();

    // Get locations count results from total database
    const total = await Location.count(queryNearSphere);

    return { data: locations, count: total };
};

locationScheme.statics.getCity = async function(filter, skip, limit, fields = '-__v', sort) {
    let searchText = '';
    if (filter.city) searchText = filter.city;
    if (filter.tags) {
        searchText = searchText.length === 0 ? filter.tags : `${searchText} ${filter.tags}`;
    }

    // create query
    const queryGetCity = {
        $text: {
            $search: searchText,
            $caseSensitive: false,
            $diacriticSensitive: false,
        },
        city: new RegExp(filter.city, 'i'),
        tags: { $in: [new RegExp(filter.tags, 'i')] },
    };

    // query with filters
    const queryLocation = Location.find(queryGetCity);
    queryLocation.skip(parseInt(skip));
    queryLocation.limit(parseInt(limit));
    queryLocation.select(fields);
    queryLocation.sort(sort);

    // query location resutls
    const locations = await queryLocation.exec();

    // Get locations count results from total database
    const total = await Location.count(queryGetCity);

    return { data: locations, count: total };
};

locationScheme.statics.getPlaceByCity = async function(filter, skip, limit, fields = '-__v', sort) {
    let searchText = '';
    //if (filter.city) searchText = filter.city;
    //if (filter.name) { searchText = (searchText.length === 0) ? filter.name : `${searchText} ${filter.name}`; }
    if (filter.name) searchText = filter.name;

    // create query
    const queryPlaceByCity = {
        $text: {
            $search: searchText,
            $caseSensitive: false,
            $diacriticSensitive: false,
        },
        city: new RegExp(filter.city, 'i'),
    };

    // query with filters
    const queryLocation = Location.find(queryPlaceByCity);
    queryLocation.skip(parseInt(skip));
    queryLocation.limit(parseInt(limit));
    queryLocation.select(fields);
    queryLocation.sort(sort);

    // queryLocation location resutls
    const locations = await queryLocation.exec();

    // Get locations count results from total database
    const total = await Location.count(queryPlaceByCity);

    return { data: locations, count: total };
};

locationScheme.statics.getPlacesByName = async function(
    filter,
    skip,
    limit,
    fields = '-__v',
    sort,
) {
    let searchText = '';
    if (filter.name) searchText = filter.name;

    // create query
    const querySearchPlace = {
        $text: {
            $search: searchText,
            $caseSensitive: false,
            $diacriticSensitive: false,
        },
        name: new RegExp(filter.name, 'i'),
    };

    // query with filters
    const queryLocation = Location.find(querySearchPlace);
    queryLocation.skip(parseInt(skip));
    queryLocation.limit(parseInt(limit));
    queryLocation.select(fields);
    queryLocation.sort(sort);

    // locations results
    const locations = await queryLocation.exec();

    // Get locations count results from total database
    const total = await Location.count(querySearchPlace);

    return { data: locations, count: total };
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
