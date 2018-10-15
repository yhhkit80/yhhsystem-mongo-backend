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

/************** 定义用户账户信息 模式userInfoSchema **************/
const userInfoSchema = mongoose.Schema({
	name: String, //用户名称
	password:  { type:String, default:'123456' },//密码
	user_id: String, //用户id
	access: { type:Array, default:['admin'] }, //角色权限
	token: String, //登录token，这里应该没有
	avator: String //用户头像地址
}, {
	collection: "user"
});

/************** 定义用户列表数据 模式 userListDataSchema **************/
const userListDataSchema = mongoose.Schema({
	data: Array
}, {
	collection: "user"
});


/************** 定义模型Model **************/
const Models = {
	UserInfo: mongoose.model('UserInfo', userInfoSchema, 'user'),
	UserListData: mongoose.model('UserListData', userListDataSchema, 'userListData'),
}

module.exports = Models;