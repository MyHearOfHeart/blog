var mysql = require('mysql');

function User(user) {
    this.name = user.name;
    this.password = user.password;
}

module.exports = User;

// 将用户信息存入数据库
User.prototype.save = function save(callback) {
    let user = {
        name: this.name,
        password: this.password,
    };
    // 创建一个connection
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'qrj200301',
        database: 'test',
        port: '3306'
    });

    // 创建一个connection
    connection.connect(function(err){
        if(err){
            console.log('[Connection]'+err);
            return callback(err);
        }
        console.log('[connection connect]  succeed!');
    });

    // ----插入
    let addSql = 'insert into user (name, password) values(?,?)';
    let param = [user.name, user.password];
    connection.query(addSql, param,function(err,rs){
        if(err){
            console.log('insert user err:',err.message);
            return callback(err);
        }
        console.log('insert user success');
        return callback(err);
        // console.log(rs);
    });

    connection.end(function(err){
        if(err){
            console.log('[cennection end] error');
            return;
         }
        console.log('[connection end] succeed!');
    });
};


User.get = function get (username, callback) {
    // 创建一个connection
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'qrj200301',
        database: 'test',
        port: '3306'
    });

    // 创建一个connection
    connection.connect(function(err){
        if(err){
            console.log('[Connection]'+err);
            return callback(err);
        }
        console.log('[connection connect]  succeed!');
    });

    let querySql = 'select * from user where name=?';
    let param = [username];
    connection.query(querySql, param, function (error, results) {
        if (error) {
            console.log('[query] user :'+error);
            return callback(error);
        }
        if(results.length == 1){
            let user =new User(results[0]);
            return callback(error, user);
        } else {
            return callback(error, null);
        }
    });

    connection.end(function(err){
        if(err){
            console.log('[cennection end] error');
            return;
        }
        console.log('[connection end] succeed!');
    });
}















