'use strict';

const localConfig = require('../localConfig');

const mongoose = require('mongoose');
const conn = mongoose.connection;

const databaseUri = localConfig.mongodb.uri || 'mongodb://localhost/apidb';

conn.on('error', err => {
    console.log('Error de mongodb: ', err);
});

conn.once('open', () => {
    console.log(`Connected to MongoDB in ${conn.name}`);
});

mongoose.connect(databaseUri);

module.exports = conn;
