var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Methods = require('../models/methods');

/* post post page. */
router.post('/', Methods.checkLogin);
router.post('/', function(req, res, next) {
    // 调用模板解析引擎，解析名为index的模板，并传入一个对象作为参数，此对象只有一个title属性
    let currentUser = req.session.user;
    let post = new Post(currentUser.name, req.body.post);
    post.save(function (err) {
        if (err) {
            console.log('error',err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        res.redirect('/u/' + currentUser.name);
    });
});

module.exports = router;
