'use strict';

const express = require('express');
const router = express.Router();
const jwtAuth = require('../../lib/jwtAuth');

router.get('/validate', jwtAuth(), async (req, res, next) => {
    res.json({ success: true });
});

module.exports = router;