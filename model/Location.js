'use strict';

const mongoose = require('mongoose');

// Definition of scheme
const locationScheme = mongoose.Schema({
    id: { type: String, unique: true },
    city: { type: String },
    name: { type: String },
    description: { type: String, default: '' },
    address: { type: String },
    postalCode: { type: String },
    cc: { type: String },
    state: { type: String },
    country: { type: String },
    formattedAddress: { type: String },
    coordinates: {
        latitude: { type: String },
        longitude:  { type: String }
    },
    rating: {
        totalVotes: { type: Number, default: 0 },
        totalValues: { type: Number, default: 0 },
        value: { type: Number }
    },
    photos: { type: [String] },
    tags: { type: [String] },
    comments:  { type: [String] }
});

/*locationScheme.index({
        city: 'text',
        id: 1
    },
    {
        weights: {
            city:1,
        },
    },
    {
        name: "locationIndex"
    }
);
*/

locationScheme.index({
    city: 'text',
    name: 'text',
    tags: 'text',
    //"$**": "text",
    id: 1 },
{
  name: "locationIndex"
}, );

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
    console.log('filter: ', filter);
    const query = Location.find(filter);

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields) : query.select('-__v');
    query.sort(sort);
    // NOTE: First execute sort and (skip and limit) late

    // Execute query and return promise
    return query.exec();
};

locationScheme.statics.getCity =
function(
    filter,
    skip,
    limit,
    fields,
    sort
    ) {

    let searchText = "";
    if (filter.city) searchText = filter.city;
    if (filter.tag) { searchText = (searchText.length === 0) ? filter.tag : `${searchText} ${filter.tag}`; }
    
    const query = Location.find({$text: {
        $search: filter.city,
        $caseSensitive: false,
        $diacriticSensitive: false
    }, city: new RegExp(filter.city, "i") });

    //const query = Location.find({ $text: {$search: filter.city} });

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields): query.select('-__v');
    query.sort(sort);

    return query.exec();
};

locationScheme.statics.getPlaceByCity =
function(
    filter,
    skip,
    limit,
    fields,
    sort
    ) {

    let searchText = "";
    //if (filter.city) searchText = filter.city;
    //if (filter.name) { searchText = (searchText.length === 0) ? filter.name : `${searchText} ${filter.name}`; }
    if (filter.name) searchText = filter.name;

    const query = Location.find({ $text: {
        $search: searchText,
        $caseSensitive: false,
        $diacriticSensitive: false
    }, city: new RegExp(filter.city, "i") });

    query.skip(parseInt(skip));
    query.limit(parseInt(limit));
    fields ? query.select(fields): query.select('-__v');
    query.sort(sort);

    return query.exec();
};

// Create the model
const Location = mongoose.model('Location', locationScheme);

/*Location.collection.dropIndexes(function (err, results) {
    // Handle errors
    console.log('err: ', err);
    console.log('results: ', results);
});*/

module.exports = Location;
