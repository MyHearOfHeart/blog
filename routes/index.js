var express = require('express');
var router = express.Router();
var Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
  // 调用模板解析引擎，解析名为index的模板，并传入一个对象作为参数，此对象只有一个title属性
  Post.get(null, function (err, posts) {
    if (err) {
      posts = [];
    }
    res.render('index', {title: '首页', posts: posts,});
  })
});

module.exports = router;
