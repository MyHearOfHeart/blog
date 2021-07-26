var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var Methods = require('../models/methods');

/* GET reg page. */
router.get('/', Methods.checkNotLogin);
router.get('/', function(req, res, next) {
    // 调用模板解析引擎，解析名为index的模板，并传入一个对象作为参数，此对象只有一个title属性
    // 若调用时app.use('/reg', regRouter);的话，则get和post处不用加'/reg'，不然访问会变成'/reg/reg'
    res.render('reg',{title: 'Reg'});
});

// 处理用户发来的post请求
router.post('/', Methods.checkNotLogin);
router.post('/', function(req, res) {
    // 检验用户两次输入的密码是否一致
    // req.body是post请求后解析过的对象，req.body['password']访问用户传递的password域的值
    if (req.body['password-repeat'] != req.body['password']) {
        // 通过它保存的变量只会在用户当前和下一次的请求中被访问，之后会被清除。通过这可以很方便的实现页面的通知和错误信息显示功能
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/reg');
    }

    // 生成口令的散列值
    // crypto是nodejs的一个核心模块，功能是加密并生成各种散列，使用前需引用
    let md5 = crypto.createHash('md5');
    let password = md5.update(req.body.password).digest('base64');

    let user = new User({
        name: req.body.username,
        password: password,
    });

    // 检查用户名是否已存在
    User.get(user.name, function (err, userfd) {
        // 此处的user为查找到的user
        if (userfd) {
            err = 'Username already exits.';
        }
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }

        // 如果不存在则创建新用户
        user.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            // 向会话对象写入了当前用户的信息，后面判断用户是否已登陆会用到
            req.session.user = user;
            console.log('success', '注册成功');
            // 模板中<%= success %>的部分将会被替换为“注册成功”
            req.flash('success', '注册成功');
            return res.redirect('/');
        });
    });
});

module.exports = router;
