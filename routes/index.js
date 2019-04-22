var express = require('express');
var router = express.Router();

const { query, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NodeJS - API' });
});

module.exports = router;
