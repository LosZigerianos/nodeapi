'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

conn.on('error', err => {
    console.log('Error de mongodb: ', err);
});

conn.once('open', () => {
    console.log(`Connected to MongoDB in ${conn.name}`);
});

mongoose.connect('mongodb://localhost/apidb');

module.exports = conn;
