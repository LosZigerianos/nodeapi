const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../../model/User');
const localConfig = require('../../localConfig');
const i18n = require('../../lib/i18n');

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

    const email = req.body.email;
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

                res.json({ success: true, token });
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
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const err = new Error(i18n.__('email_registered'));
            err.status = 422;
            next(err);
            return;
        }

        req.body.password = await crypto.createHash('sha256').update(req.body.password).digest('base64');

        const newUser = new User(req.body);

        const userStored = await newUser.save();
        
        res.json({ success: true, result: userStored});

    } catch(err) {
        next(err);
        return;
    }
});

module.exports = router;
