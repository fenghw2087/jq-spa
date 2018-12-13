/**
 * Created by Administrator on 2018/7/25.
 */
var express = require('express');
var router = express.Router();
var config = require('../config/chunkConfig');

router.get('/index', function(req, res, next) {
    res.render('tag',{ hash: config.hashChunks['tag']});
});
router.get('/detail', function(req, res, next) {
    res.render('tag',{ hash: config.hashChunks['tag']});
});

router.post('/list', function(req, res, next) {
    var result = {
        success:true,
        data:{
            searchPage:{
                pageIndex:1,
                totalRecord:20,
                pageData:new Array(5).fill(1).map((v,i)=>{
                    return {
                        createTime:	'2018-7-22',
                        enable:1,
                        id:i+1,
                        labelNo:'l44848'+(i+1),
                        modifiedTime:'2018-7-22',
                        name:'标签'+(i+1)
                    }
                })
            }
        }
    };
    res.send(result);
});

module.exports = router;
