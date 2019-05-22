const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../../model/User');
const localConfig = require('../../localConfig');
const i18n = require('../../lib/i18n');
const nodemailer = require('nodemailer');
const jwtAuth = require('../../lib/jwtAuth');
const uploadS3 = require('../../lib/uploadS3');
const IMAGE_TYPE = uploadS3.IMAGE_TYPE;

/**
 * POST /login
 * Return a JWT with user data
 */
router.post('/login', async (req, res, next) => {
    i18n.checkLanguage(req);

    if (!req.body.email) {
        res.json({ success: true, error: i18n.__('field_requiered %s', 'email') });
        return;
    }

    if (!req.body.password) {
        res.json({ success: true, error: i18n.__('field_requiered %s', 'password') });
        return;
    }

    const email = new RegExp('^' + req.body.email + '$', "i");
    const password = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('base64');

    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            res.json({ success: true, error: i18n.__('invalid_credentials') });
            return;
        }

        if (password !== user.password) {
            res.json({ success: true, error: i18n.__('invalid_credentials') });
            return;
        }

        jwt.sign(
            { user_id: user._id },
            localConfig.jwt.secret,
            { expiresIn: localConfig.jwt.expiresIn },
            (err, token) => {
                if (err) {
                    next(err);
                    return;
                }

                res.json({ success: true, metadata: user, data: token });
            },
        );
    } catch (err) {
        next(err);
        return;
    }
});

/**
 * POST /signup
 * Return a user registered data
 */
router.post('/signup', async (req, res, next) => {
    i18n.checkLanguage(req);

    if (!req.body.email || !req.body.password) {
        res.json({ success: true, error: i18n.__('field_requiered') });
        return;
    }

    try {
        const userByEmail = await User.findOne({ email: new RegExp('^' + req.body.email + '$', "i") });
        if (userByEmail) {
            res.json({ success: true, error: i18n.__('email_registered') });
            return;
        }

        const userByUsername = await User.findOne({ username: new RegExp(req.body.username, "i") });
        if (req.body.username && userByUsername) {
            res.json({ success: true, error: i18n.__('username_registered') });
            return;
        }

        req.body.password = await crypto
            .createHash('sha256')
            .update(req.body.password)
            .digest('base64');

        const newUser = new User(req.body);

        const userStored = await newUser.save();

        res.json({ success: true, data: userStored });
    } catch (err) {
        next(err);
        return;
    }
});

/**
 * POST /recoverPassword
 *
 */
router.post('/recoverPassword', async (req, res, next) => {
    i18n.checkLanguage(req);

    if (!req.body.email) {
        res.json({ success: true, error: i18n.__('invalid_credentials') });
        return;
    }

    const email = new RegExp('^' + req.body.email + '$', "i");
    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            res.json({ success: true, error: i18n.__('invalid_credentials') });
            return;
        }

        // Define the transporter
        const transporter = nodemailer.createTransport({
            service: localConfig.nodemailer.provider,
            auth: {
                user: localConfig.nodemailer.email,
                pass: localConfig.nodemailer.password,
            },
        });

        const recoverPassword = crypto.randomBytes(10).toString('hex');

        // Define the email
        const mailOptions = {
            from: localConfig.nodemailer.email,
            to: user.email,
            subject: `JourTrip: ${i18n.__('recover_password')}`,
            text: `${i18n.__('new_password')}: ${recoverPassword}`,
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                const err = new Error(error.message);
                err.status = 500;
                return next(err);
            }
        });

        user.password = crypto
            .createHash('sha256')
            .update(recoverPassword)
            .digest('base64');
        const _ = await User.findOneAndUpdate({ _id: user._id }, user, { new: true }).exec();

        res.json({ success: true, message: i18n.__('sent_email') });
    } catch (err) {
        next(err);
        return;
    }
});

/**
 * PUT /me/change-password
 * Return a user data
 */
router.put('/me/change-password', jwtAuth(), async (req, res, next) => {
    i18n.checkLanguage(req);

    const { password, newPassword, passwordConfirmation } = req.body;

    if (!password) {
        res.json({ success: true, error: i18n.__('field_requiered %s', 'password') });
        return;
    }

    if (!newPassword) {
        res.json({ success: true, error: i18n.__('field_requiered %s', 'newPassword') });
        return;
    }
    if (!passwordConfirmation) {
        res.json({ success: true, error: i18n.__('field_requiered %s', 'passwordConfirmation') });
        return;
    }

    if (newPassword !== passwordConfirmation) {
        res.json({ success: true, error: i18n.__('should_them_be_equals %s %s', 'newPassword', 'passwordConfirmation') });
        return;
    }

    const passwordHash = crypto
        .createHash('sha256')
        .update(newPassword)
        .digest('base64');

    try {
        const query = { _id: req.user_id };
        const update = { password: passwordHash };
        
        const userUpdated = await User.findOneAndUpdate(query, update);

        res.json({ success: true, data: userUpdated });
    } catch (err) {
        return next(err);
    }
});

/**
 * PUT /me/update
 * Return a user data
 */
router.put('/me/update', jwtAuth(), async (req, res, next) => {
    i18n.checkLanguage(req);

    const { fullname, username, email } = req.body;
    const props = {};

    try {
        const currentUser = await User.findById(req.user_id).exec();

        if (fullname) {
            props.fullname = fullname;
        }

        const regexUsername = new RegExp(username, 'i');
        const userByUsername = await User.findOne({ username: regexUsername }).exec();

        // verify:
        // username is not undefined and exists an user with that username
        // existing user is different from a logged user
        if (username && userByUsername && currentUser.username !== userByUsername.username) {
            res.json({ success: true, error: i18n.__('username_registered') });
            return;
        } else if (username) {
            props.username = username;
        }

        const regexEmail = new RegExp(email, 'i');
        const userByEmail = await User.findOne({ email: regexEmail }).exec();

        // verify:
        // email is not undefined and exists an user with that email
        // existing user is different from a logged user
        if (email && userByEmail && currentUser.email !== userByEmail.email) {
            res.json({ success: true, error: i18n.__('email_registered') });
        } else if (email) {
            props.email = email;
        }

        const userUpdated = await currentUser.update(props);

        res.json({ success: true, data: userUpdated });
    } catch (err) {
        return next(err);
    }
});

/**
 * POST /me/photo
 * Return a user data
 */
router.post('/me/photo', jwtAuth(), uploadS3.single('image'), async (req, res, next) => {
    i18n.checkLanguage(req);

    if (!req.file) {
        res.json({ success: true, error: i18n.__('field_requiered %s', 'image') });
        return;
    }

    const userPerfilPath = req.file.transforms[IMAGE_TYPE.ORIGINAL].location;

    try {
        const query = { _id: req.user_id };
        const update = { photo: userPerfilPath };
        const updatedUser = await User.findOneAndUpdate(query, update);

        res.json({ success: true, data: userPerfilPath, metadata: updatedUser });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /me
 * Return a user data
 */
router.get('/me', jwtAuth(), async (req, res, next) => {
    i18n.checkLanguage(req);

    try {
        const currentUser = await User.findOne({ _id: req.user_id }).exec();

        res.json({ success: true, data: currentUser });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
