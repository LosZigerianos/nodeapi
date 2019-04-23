'use strict';

const mongoose = require('mongoose');

// Definition of scheme
const userScheme = mongoose.Schema({
    name: { type: String },
    surname: { type: String },
    email: { type: String, unique: true }, // required: true, 
    password: { type: String },
    token: { type: String },

    googleId: { type: String },
    updated_at: { type: Date, default: Date.now },
    provider: { type: String, default: 'local' }
});

userScheme.index({ name: 1, surname: 1, email: 1, updated_at: -1, provider: 1 });

// Create the model
const User = mongoose.model('User', userScheme);

module.exports = User;
