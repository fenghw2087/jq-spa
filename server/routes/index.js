var express = require('express');
var router = express.Router();
var config = require('../config/chunkConfig');
var multer  = require('multer');
var upload = multer({ dest: 'upload/' });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login',{ hash: config.hashChunks['login']});
});

router.get('/goodsList', function(req, res, next) {
    res.render('goodsList',{ hash: config.hashChunks['goodsList']});
});

router.get('/goodsInput', function(req, res, next) {
    res.render('goodsInput',{ hash: config.hashChunks['goodsInput']});
});

router.get('/supplier', function(req, res, next) {
    res.render('supplier',{ hash: config.hashChunks['supplier']});
});

router.get('/tag', function(req, res, next) {
    res.render('tag',{ hash: config.hashChunks['tag']});
});

router.get('/userInfo', function(req, res, next) {
    res.render('userInfo',{ hash: config.hashChunks['userInfo']});
});


router.post('/uploadFile', upload.single('file'), function(req, res){
    res.send({ret_code: '0',data:req.file.originalname});
});

module.exports = router;
