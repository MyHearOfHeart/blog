
// 将session存入MySQL数据库例子
const express=require("express");
const mysql=require("mysql");
//const cors=require("cors"); // 处理跨域
const session=require("express-session");
const MySQLStore=require('express-mysql-session')(session);

var app=express();

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
    saveUninitialized: true, // 初始化session时是否保存到存储。默认为true， 但是(后续版本)有可能默认失效，所以最好手动添加。
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

//app.use(cors());

app.use('/login',function(req, res){
    //设置session
    req.session.userinfo = '张三';
    res.send("登陆成功！");
});

app.use('/loginOut',function(req, res){
    //注销session
    req.session.destroy(function(err){
        res.send("退出登录！" + err);
    });
});

// 数据库里面确实存有数据，但却无法直接看得到
app.use('/',function(req, res){
    //获取session
    if(req.session.userinfo){
        res.send("hello " + req.session.userinfo + "，welcome to index");
    }else{
        res.send("未登陆");
    }
});

app.listen(8080);















