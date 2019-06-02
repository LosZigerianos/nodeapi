'use strict';
const mongoose = require('mongoose');
const constants = require('../commons/constants');
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
    photo: { type: String, default: constants.DEFAULT_PHOTO },
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
    const user = await User.findById(userId).populate({
        // comments
        path: constants.COMMENTS,
        select: fieldsComments,
        options: {
            sort: sortComments,
            limit: parseInt(limitComments),
            skip: parseInt(skipComments),
        },
        // locations inside comments
        populate: { path: constants.LOCATION, model: 'Location', select: fieldsLocations },
    });

    // get comments size from database for this user
    const commentsCount = await User.getSubDocumentCount(user, constants.COMMENTS);

    // add comments count to user object
    const userProfileInfo = user.toFullInfo();
    userProfileInfo.commentsCount = commentsCount;

    return userProfileInfo;
};

userSchema.statics.getSubDocumentCount = async function(user, subDocument) {
    const result = await User.aggregate()
        .match({ email: user.email })
        .project({ count: { $size: '$' + subDocument } })
        .group({ _id: null, total: { $sum: '$count' } });

    return result[0].total;
};

userSchema.statics.findByIdAndGetFollowing = function(userId, skip, limit, fields, sort) {
    return findByIdAndPopulateDocument(userId, constants.FOLLOWING, skip, limit, fields, sort);
};
userSchema.statics.findByIdAndGetFollowers = function(userId, skip, limit, fields, sort) {
    return findByIdAndPopulateDocument(userId, constants.FOLLOWERS, skip, limit, fields, sort);
};

const findByIdAndPopulateDocument = async function(
    userId,
    subDocumentToPopulate,
    skip,
    limit,
    fields = '-__v',
    sort = '-creationDate',
) {
    const user = await User.findById(userId).populate({
        path: subDocumentToPopulate,
        select: fields,
        options: {
            sort: sort,
            limit: parseInt(limit),
            skip: parseInt(skip),
        },
    });

    // get subdocument size from database for this user
    const subDocumentCount = await User.getSubDocumentCount(user, subDocumentToPopulate);

    return { data: user, count: subDocumentCount };
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
