'use strict';

const mongoose = require('mongoose');

// Definition of scheme
const userScheme = mongoose.Schema({
    name: { type: String },
    surname: { type: String },
    email: { type: String, unique: true }, // required: true, 
    password: { type: String },

    userid: { type: String },
    updated_at: { type: Date, default: Date.now }
});

userScheme.index({ name: 1, email: 1 });

//userScheme.statics.findOrCreate = require("find-or-create");

// Create the model
const User = mongoose.model('User', userScheme);

module.exports = User;
