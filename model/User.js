'use strict';

const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    fullname: { type: String },
    username: { type: String, unique: true }, // , unique: true
    email: { type: String, unique: true, required: true }, // required: true, 
    password: { type: String },
    token: { type: String },
    creationDate: { type: Date, default: Date.now },

    googleId: { type: String },
    updated_at: { type: Date, default: Date.now },
    provider: { type: String, default: 'local' }
});

userScheme.index({ fullname: 1, username: 1, email: 1, creationDate: 1, provider: 1 });

const User = mongoose.model('User', userScheme);

module.exports = User;
