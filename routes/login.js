var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var Methods = require('../models/methods');

/* GET login page. */
router.get('/', Methods.checkNotLogin);
router.get('/', function(req, res, next) {
    // 调用模板解析引擎，解析名为index的模板，并传入一个对象作为参数，此对象只有一个title属性
    // 若调用时app.use('/reg', regRouter);的话，则get和post处不用加'/reg'，不然访问会变成'/reg/reg'
    res.render('login',{title: 'Login'});
});

// 处理用户发来的post请求
router.post('/', Methods.checkNotLogin);
router.post('/', function(req, res) {
    // 检验用户两次输入的密码是否一致
    // req.body是post请求后解析过的对象，req.body['password']访问用户传递的password域的值
    let md5 = crypto.createHash('md5');
    let password = md5.update(req.body.password).digest('base64');

    // 检查用户名是否已存在
    User.get(req.body.username, function (err, user) {
        // 此处的user为查找到的user
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }

        if (user.password != password) {
            req.flash('error', '用户密码错误');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/');
    });
});

module.exports = router;
