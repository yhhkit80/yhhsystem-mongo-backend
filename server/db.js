const mongoose = require('mongoose');
// 报错DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated
// 解决：
mongoose.Promise = global.Promise;
// 连接数据库
mongoose.connect('mongodb://localhost:27017/yhhsystem', {
    useNewUrlParser: true
});

// 为这次连接绑定事件
const db = mongoose.connection;
db.once('error', () => console.log('Mongo connection error'));
db.once('open', () => console.log('Mongo connection successed'));

//引入需要使用的schema定义
const user = require('../models/user');

/****** 定义模型Model ******/
const Models = {
    UserInfo: mongoose.model('UserInfo', user.userInfoSchema, 'user'),
    UserListData: mongoose.model('UserListData', user.userListDataSchema, 'userListData'),
}

module.exports = Models;