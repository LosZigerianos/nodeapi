const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../../model/User');
const localConfig = require('../../localConfig');
const i18n = require('../../lib/i18n');
const nodemailer = require('nodemailer');

router.post('/login', async (req, res, next) => {
    i18n.checkLanguage(req);

    if (!req.body.email) {
        res.json({ success: true, message: i18n.__('invalid_credentials') });
        return;
    }

    if (!req.body.password) {
        res.json({ success: true, message: i18n.__('invalid_credentials') });
        return;
    }

    const email = new RegExp(req.body.email, "i");
    const password = crypto.createHash('sha256').update(req.body.password).digest('base64');

    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            res.json({ success: true, message: i18n.__('invalid_credentials') });
            return;
        }

        if (password !== user.password) {
            res.json({ success: true, message: i18n.__('invalid_credentials') });
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

                res.json({ success: true, metadata: user , data: token });
            });

    } catch(err) {
        next(err);
        return;
    }
});

router.post('/signup', async (req, res, next) => {
    i18n.checkLanguage(req);
    
    if (!req.body.email || !req.body.password) {
        const err = new Error(i18n.__('field_requiered'));
        err.status = 404;
        next(err);
        return;
    }

    try {
        const userByEmail = await User.findOne({ email: new RegExp(req.body.email, "i") });
        if (userByEmail) {
            const err = new Error(i18n.__('email_registered'));
            err.status = 422;
            next(err);
            return;
        }

        const userByUsername = await User.findOne({ username: req.body.username });
        if (req.body.username && userByUsername) {
            const err = new Error(i18n.__('username_registered'));
            err.status = 422;
            next(err);
            return;
        }

        req.body.password = await crypto.createHash('sha256').update(req.body.password).digest('base64');

        const newUser = new User(req.body);

        const userStored = await newUser.save();
        
        res.json({ success: true, data: userStored});

    } catch(err) {
        next(err);
        return;
    }
});

router.post('/recoverPassword', async (req, res, next) => {
    i18n.checkLanguage(req);

    if (!req.body.email) {
        res.json({ success: true, message: i18n.__('invalid_credentials') });
        return;
    }

    const email = new RegExp(req.body.email, "i");

    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            res.json({ success: true, message: i18n.__('invalid_credentials') });
            return;
        }

        // Define the transporter
        const transporter = nodemailer.createTransport({
            service: localConfig.nodemailer.provider,
            auth: {
                user: localConfig.nodemailer.email,
                pass: localConfig.nodemailer.password
            }
        });

        const recoverPassword = crypto.randomBytes(10).toString('hex');

        // Define the email
        const mailOptions = {
            from: localConfig.nodemailer.email,
            to: user.email,
            subject: `JourTrip: ${i18n.__('recover_password')}`,
            text: `${i18n.__('new_password')}: ${recoverPassword}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                const err = new Error(error.message);
                err.status = 500;
                return next(err);
            }
        });

         user.password = crypto.createHash('sha256').update(recoverPassword).digest('base64');
         const _  = await User.findOneAndUpdate({ _id: user._id }, user, { new: true }).exec();
         
         res.json({ success: true, message: i18n.__('sent_email')});

    } catch(err) {
        next(err);
        return;
    }
});

module.exports = router;
