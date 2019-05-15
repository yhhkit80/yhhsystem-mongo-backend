const mongoose = require('mongoose');
let Schema = mongoose.Schema;
/****** 定义用户账户信息 模式userInfoSchema ******/
const userInfoSchema = new Schema({
    user_id: String, //用户id
    name: String, //用户名称
    phone: String, //手机号码
    password: {
        type: String,
        default: '123456'
    }, //密码
    avator: String, //用户头像地址
    access: {
        type: Array,
        default: ['dev']
    }, //角色权限
    disabled: String, //用户是否禁用，0不禁用，1禁用
    token: String, //
    modifytime: {
        type: Date,
        default: Date.now
    }, //角色修改时间
    createtime: {
        type: Date,
        default: Date.now
    }, //角色创建时间
}, {
    collection: "user"
});

/****** 定义用户列表数据 模式 userListDataSchema ******/
const userListDataSchema = new Schema({
    //data: Array
    rows: [{
        user_id: String, //用户id
        name: String, //用户名称
        phone: String, //手机号码
        avator: String, //用户头像地址
        access: {
            type: Array,
        }, //角色权限
        createtime: Date, //角色创建时间
    }]
}, {
    collection: "user"
});

module.exports = {
    userInfoSchema: userInfoSchema,
    userListDataSchema: userListDataSchema
};