var express = require('express');
var router = express.Router();
var config = require('../config/chunkConfig');

router.get('/index', function(req, res, next) {
    res.render('category',{ hash: config.hashChunks['category']});
});
router.get('/detail', function(req, res, next) {
    res.render('category',{ hash: config.hashChunks['category']});
});

module.exports = router;
