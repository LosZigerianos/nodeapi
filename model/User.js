'use strict';
const Comment = require('./Comment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    fullname: { type: String, default: '' },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    token: { type: String },
    creation_date: { type: Date, default: Date.now },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    photo: { type: String },
    googleId: { type: String },
    updated_at: { type: Date, default: Date.now },
    provider: { type: String, default: 'local' },
});

userSchema.index({ fullname: 1, username: 1, email: 1, creationDate: 1, provider: 1 });

userSchema.set('toJSON', {
    transform: function(doc, ret, options) {       
        ret.followers = ret.followers.length;
        ret.following = ret.following.length;
        ret.comments = ret.comments.length;
        delete ret.password;
        delete ret.__v;
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
