'use strict';

const mongoose = require('mongoose');

// Definition of scheme
const userScheme = mongoose.Schema({
    name: { type: String },
    surname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userScheme.index({ name: 1, email: 1 });

// Create the model
const User = mongoose.model('User', userScheme);

module.exports = User;
