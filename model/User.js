'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Constants = {
    FOLLOWERS: 'followers',
    FOLLOWING: 'following',
    COMMENTS: 'comments',
    LOCATION: 'location',
    DEFAULT_PHOTO: 'images/user-profile.png',
};

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
    photo: { type: String, default: Constants.DEFAULT_PHOTO },
    googleId: { type: String },
    updated_at: { type: Date, default: Date.now },
    provider: { type: String, default: 'local' },
});

userSchema.index({ fullname: 1, username: 1, email: 1, creationDate: 1, provider: 1 });

userSchema.statics.findByIdAndGetFullData = async function(
    userId,
    skipComments,
    limitComments,
    fieldsComments = '-__v -user',
    sortComments = '-creationDate',
    fieldsLocations = '-id -__v',
) {
    const query = await User.findById(userId).populate({
        // comments
        path: Constants.COMMENTS,
        select: fieldsComments,
        options: {
            sort: sortComments,
            limit: parseInt(limitComments),
            skip: parseInt(skipComments),
        },
        // locations inside comments
        populate: { path: Constants.LOCATION, model: 'Location', select: fieldsLocations },
    });

    return query.toFullInfo();
};

userSchema.statics.findByIdAndGetFollowing = function(userId, skip, limit, fields, sort) {
    return findByIdAndPopulateDocument(userId, Constants.FOLLOWING, skip, limit, fields, sort);
};
userSchema.statics.findByIdAndGetFollowers = function(userId, skip, limit, fields, sort) {
    return findByIdAndPopulateDocument(userId, Constants.FOLLOWERS, skip, limit, fields, sort);
};

const findByIdAndPopulateDocument = function(
    userId,
    documentToPopulate,
    skip,
    limit,
    fields = '-__v',
    sort = '-creationDate',
) {
    const query = User.findById(userId).populate({
        path: documentToPopulate,
        select: fields,
        options: {
            sort: sort,
            limit: parseInt(limit),
            skip: parseInt(skip),
        },
    });

    return query.exec();
};

userSchema.methods.toJSON = function() {
    const user = this.toObject();

    delete user.followers;
    delete user.following;
    delete user.comments;
    delete user.password;
    delete user.__v;

    return user;
};

userSchema.methods.toFullInfo = function() {
    const user = this.toObject();

    user.followers = user.followers.length;
    user.following = user.following.length;
    user.commentsCount = user.comments.length;

    delete user.password;
    delete user.__v;

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
