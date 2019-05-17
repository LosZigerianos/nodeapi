'use strict';

const jwt = require('jsonwebtoken');
const localConfig = require('../localConfig');

module.exports = () => {
    return (req, res, next) => {
        const token = req.body.token || req.query.token || req.get('x-access-token');

        if (!token) {
            const err = new Error('No token provided');
            err.status = 401;
            next(err);
            return;
        }

        jwt.verify(token, localConfig.jwt.secret, (err, decoded) => {
            if (err) {
                err.status = 401;
                next(err);
                return;
            }

            // Añadimos el id del usuario al request, para poder obtener en los middleware de adelante
            req.user_id = decoded.user_id;
            next();
        });
    };
};
