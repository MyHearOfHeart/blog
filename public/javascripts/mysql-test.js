// 此文件用于测试连接MySQL数据库

var mysql = require('mysql')

// 创建一个connection
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qrj200301',
    database: 'test',
    port: '3306'
});

// connection.connect()


// 创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err)
        return
    }
    console.log('[connection connect]  succeed!')
})

connection.query('SELECT * from fish', function (error, results) {
    if (error) {
        console.log('[query] - :'+error);
        return;
    }
    console.log('--------------------------query----------------------------');
    for(let i=0; i<results.length; i++){
        console.log(results[i].name);
        console.log(results[i]);
    }
    console.log('------------------------------------------------------');
})

/*
// 执行查询
connection.query('SELECT * from user where id=?',[2], function(err, rs) {
    if (err) {
        console.log('[query] - :'+err);
        return;
    }
    for(var i=0;i<rs.length;i++){
        console.log('The solution is: ', rs[i].uname);
    }
});

 */

// ----插入
let addSql = 'insert into fish (id, name) values(?,?)';
let param = [3,'abcd'];
connection.query(addSql, param,function(err,rs){
    if(err){
        console.log('insert err:',err.message);
        return;
    }
    console.log('insert success')
    console.log(rs);
});

// 更新
let modSql = 'UPDATE fish set name = ? WHERE Id = ?';
let modSqlParams = ['xiaolou',3];
connection.query(modSql,modSqlParams,function (err, result) {
    if(err){
        console.log(err.message);
        return;
    }
    console.log('--------------------------UPDATE----------------------------');
    console.log('UPDATE affectedRows',result.affectedRows);
    console.log('-----------------------------------------------------------------');
});

// 删除
let delSql = 'DELETE FROM fish where id=3';
connection.query(delSql,function (err, result) {
    if(err){
        console.log(err.message);
        return;
    }
    console.log('--------------------------DELETE----------------------------');
    console.log('DELETE affectedRows',result.affectedRows);
    console.log('-----------------------------------------------------------------');
});

// 关闭connection
connection.end(function(err){
    if(err){
        console.log(err.toString());
        return;
    }
    console.log('[connection end] succeed!');
});










