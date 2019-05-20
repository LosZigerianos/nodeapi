'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = Schema({
    fullname: { type: String, default: '' },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    token: { type: String },
    creation_date: { type: Date, default: Date.now },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    photo: { type: String },

    googleId: { type: String },
    updated_at: { type: Date, default: Date.now },
    provider: { type: String, default: 'local' }
});

userScheme.index({ fullname: 1, username: 1, email: 1, creationDate: 1, provider: 1 });

const User = mongoose.model('User', userScheme);

module.exports = User;
