var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');

/* GET user page. */
router.get('/:user', function(req, res, next) {
    // 调用模板解析引擎，解析名为index的模板，并传入一个对象作为参数，此对象只有一个title属性
    console.log(req.params);
    console.log(req.params.user);
    User.get(req.params.user, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        Post.get(user.name, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('user', {title: user.name, posts: posts,});
        })
    })
});

module.exports = router;
