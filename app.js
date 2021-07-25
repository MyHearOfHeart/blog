var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // Cookie解析的中间件
var logger = require('morgan');
var mysql=require("mysql");
//const cors=require("cors"); // 处理跨域
var session=require("express-session");
var MySQLStore=require('express-mysql-session')(session);
var flash = require('connect-flash');
var parials = require('express-partials');
var fs = require('fs');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var regRouter = require('./routes/reg');
var logoutRouter = require('./routes/logout');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/user');
var postRouter = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(parials());

// 实现日志功能
var accessLogfile = fs.createWriteStream('access.log', {flag: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flag: 'a'});
app.use(express.logger({stream: accessLogfile}));





// 配置mysql
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'qrj200301',
  database: 'test'
};

var sessionConnection = mysql.createConnection(options);
var sessionStore = new MySQLStore({
  expiration: 10800000,
  createDatabaseTable: true,	//是否创建表
  schema: {
    tableName: 'session',	//表名
    columnNames: {		//列选项
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, sessionConnection);

//配置中间件
app.use(session({
  key: 'session_cookie_name',
  secret: "session_cookie_secret", // 一个String类型的字符串，作为服务器端生成session的签名。
  store: sessionStore,
  resave: false, //(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。默认为true。但是(后续版本)有可能默认失效，所以最好手动添加。
  saveUninitialized: false, // 初始化session时是否保存到存储。默认为true， 但是(后续版本)有可能默认失效，所以最好手动添加。
  // 设置返回到前端key的属性，默认值为{ path: '/', httpOnly: true, secure: false, maxAge: null }。
  /*
  cookie: ('name', 'value',{	maxAge:  5*60*1000,
      secure: false,
      name: "seName",
      resave: false})
   */
  cookie: {
    maxAge: 6 * 60 * 60 * 1000
  }
}));

// 这东西要在session后路由前引用，使用时需引入connect-flash模块
app.use(flash());
// 增加动态视图助手。动态视图相当于路由，所以要在路由前使用
app.use(function (req, res, next) {
  // 定义动态视图助手变量
  res.locals.appUrl = req.url;
  // 添加动态视图助手方法函数
  res.locals.user = req.session.user;

  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');

  // 不要忘记加next()
  next();
});


// 如果用户访问/路径，则由indexRouter来控制
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reg', regRouter);
app.use('/logout', logoutRouter);
app.use('/login', loginRouter);
app.use('/u', userRouter);
app.use('/post', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  // 将错误写入日志文件
  errorLogfile.write(new Date() + err.message + '\n');
});

// 判断当前模块是不是由其它模块调用的。不是，说明是直接启动的，启动调试服务器。是，不自动启动服务器。
// if (!module.parent) {
//   app.listen(3000);
// }





module.exports = app;
