var mysql = require('mysql');

function Post(name, post, time) {
    this.name = name;
    this.post = post;
    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
}

module.exports = Post;


// 保存
Post.prototype.save = function save(callback) {
    let post = {
        name: this.name,
        post: this.post,
        time: this.time,
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
    let addSql = 'insert into post (name, post, time) values(?,?,?)';
    let param = [post.name, post.post, post.time];
    connection.query(addSql, param,function(err,rs){
        if(err){
            console.log('insert post err:',err.message);
            return callback(err);
        }
        console.log('insert post success');
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


// 获取，可以根据用户名获取
Post.get = function get(username, callback) {
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

    let querySql;
    let param;
    if (username) {
        querySql = 'select * from post where name=?';
        param = [username];
    } else {
        querySql = 'select * from post';
        param = [];
    }
    connection.query(querySql, param, function (error, results) {
        if (error) {
            console.log('[query post] :'+error);
            return callback(error);
        }
        let posts = [];
        for (let i=0;i<results.length;i++) {
            let post = new Post(results[i].name, results[i].post, results[i].time);
            posts.push(post);
        }
        return callback(null, posts);
    });

    connection.end(function(err){
        if(err){
            console.log('[cennection end] error');
            return;
        }
        console.log('[connection end] succeed!');
    });
};














