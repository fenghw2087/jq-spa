/**
 * Created by Administrator on 2018/7/30.
 */
var express = require('express');
var router = express.Router();
var config = require('../config/chunkConfig');

router.get('/account', function(req, res, next) {
    res.render('users',{ hash: config.hashChunks['users']});
});
router.get('/role', function(req, res, next) {
    res.render('users',{ hash: config.hashChunks['users']});
});

router.post('/account/list', function(req, res, next) {
    var result = {
        success:true,
        data:{
            searchPage:{
                pageIndex:1,
                totalRecord:20,
                pageData:new Array(5).fill(1).map((v,i)=>{
                    return {
                        username:'hduwhdwudhu'+(i+1),
                        realname:'用户'+(i+1),
                        phone:1865880780+''+(i+1),
                        roleId:Math.ceil(Math.random()*5),
                        status:Math.random()>0.5?1:0
                    }
                })
            }
        }
    };
    res.send(result);
});

router.post('/role/list', function(req, res, next) {
    var result = {
        success:true,
        data:{
            searchPage:{
                pageIndex:1,
                totalRecord:5,
                pageData:new Array(5).fill(1).map((v,i)=>{
                    return {
                        name:'角色类型'+(i+1),
                        goodsType:Math.ceil(Math.random()*2),
                        priceType:Math.ceil(Math.random()*3),
                        pageType:'功能权限功能权限功能权限功能权限',
                        id:(i+1)
                    }
                })
            }
        }
    };
    res.send(result);
});

module.exports = router;