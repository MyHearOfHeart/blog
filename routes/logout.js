var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res, next) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});

module.exports = router;
