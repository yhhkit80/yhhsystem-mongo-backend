"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
const cryptoken = require('./token');

models.UserInfo.find((err, data) => {
    // if (err) {
    //     res.send(err);
    // } else {
    //     //if(data)
    //     res.send(data);
    // }
    // console.log(data)
});
/************** 创建(create) 读取(get) 更新(update) 删除(delete) **************/

// 根据用户登录信息获取token
router.post('/api/login/getToken', (req, res) => {
    let tempInfo = {
        user_id: req.body.user_id,
        password: req.body.password
    }
    const token = req.headers['x-access-token'] //前端请求时带入cookies中的token值
    // 通过模型去查找数据库
    models.UserInfo.findOne({
        user_id: tempInfo.user_id,
        password: tempInfo.password
    }, {
        password: 0, //返回字段不包括password和token
        token: 0
    }, (err, data) => {
        console.log(data)
        if(err) {
            res.send(err);
        } else {
            console.log('登录接口 /api/login/getToken  查询参数: ' + JSON.stringify(req.body), '查询结果' + data);
            if(data) {
                //const newToken = data.user_id + Date.now()
                const newToken = cryptoken.createToken({
                    "iss": "yhhsystem",
                    "user_id": tempInfo.user_id,
                }, 24 * 60 * 60)
                console.log(newToken)
                //更新用户的token值
                models.UserInfo.findOneAndUpdate({
                    user_id: tempInfo.user_id,
                    password: tempInfo.password
                }, {
                    token: newToken
                }).exec().then((info) => { //返回的是查询修改前的字段
                    console.log('exec--', info)
                    /*res.setHeader(200, {
        'Set-Cookie': 'token='+newToken,
    	});*/
                    res.cookie("token", newToken); //设置cookie
                    //res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
                    res.send({
                        code: 200,
                        msg: '查询成功',
                        data: {
                            token: newToken
                        }
                    })
                })
                /*models.UserInfo.update({
                		user_id: tempInfo.user_id,
                		password: tempInfo.password
                	}, {
                		token: newToken
                	}, (u_err, u_data) => {
                		if(u_err) {
                			res.send(u_err);
                		} else {
                			res.status(200).send({
                				code: 200,
                				msg: '查询成功',
                				data: {
                					token: newToken
                				}
                			})
                	}
                })*/
                /*res.send({
                	code: 200,
                	msg: '查询成功',
                	data: {
                		token: newToken
                	}
                })*/
            } else
                res.send({
                    code: 9001,
                    msg: '用户名或密码错误，请重新输入',
                })
        }
    });
});

// 根据token获取帐号信息
router.post('/api/login/getAccount', (req, res) => {
    //const token = req.headers['x-access-token'] //前端请求时带入cookies中的token值
    //console.log('后台获取headers中的token', token)
    const token = req.cookies.token;
    const check = cryptoken.checkToken(token);
    console.log('检查token：', check)
    if(!check){
        res.send({
                    code: 9001,
                    msg: '用户未登录或登录已过期',
                })
        return;
    }
    
    // 通过模型去查找数据库
    models.UserInfo.findOne({
        token: token
    }, {
        password: 0, //返回字段不包括password和token
        token: 0
    }, (err, data) => {
        if(err) {
            res.send(err);
        } else {
            console.log('获取帐号信息接口 /api/login/getAccount  查询参数: ' + JSON.stringify(req.body), '查询结果' + data);
            if(data)
                res.send({
                    code: 200,
                    msg: '查询成功',
                    data: data
                })
            else
                res.send({
                    code: 9001,
                    msg: '未查询到匹配项',
                })
        }
    });
});
//获取用户列表
router.get('/api/users/getUserList', (req, res) => {
    //console.log('查询参数', req.body)
    models.UserInfo.find({

    }, (err, data) => {
        if(err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})

// 注册账号
router.post('/api/users/register', (req, res) => {
    let newAccount = new models.UserInfo({
        user_id: req.body.user_id,
        nickname: req.body.nickname,
        password: req.body.password,
        phone: req.body.phone
    });
    let tempInfo = {
        nickname: req.body.nickname,
        phone: req.body.phone
    }
    // 通过模型去查找数据库
    models.UserInfo.find((err, data) => {
        if(err) {
            res.send(err);
        } else {
            //if(data)
            for(let item of data) {
                console.log(JSON.stringify(item), JSON.stringify(tempInfo))
                console.log('1', item['nickname'] != '')
                console.log('2', item['nickname'] == tempInfo.nickname)
                console.log('遍历', item['nickname'] != '' && (item['nickname'] == tempInfo.nickname))
                if((item['nickname'] != '' && (item['nickname'] == tempInfo.nickname)) || (item['phone'] != '' && (item['phone'] == tempInfo.phone))) {
                    res.send({
                        respCode: 1,
                        respMsg: '该用户已存在'
                    })
                    return;
                }
            }
            // 保存数据newAccount数据进mongoDB
            newAccount.save((err, data) => {
                if(err) {
                    res.send(err);
                } else {
                    res.send({
                        errcode: 0
                    });
                }
            });
        }
    });

});

// 注销账号
router.post('/api/users/delete', (req, res) => {
    let user_id = req.body.user_id
    // 通过模型去查找数据库
    models.UserInfo.update({
        name: user_id
    }, {
        $set: {
            disabled: '1'
        }
    }, (err, data) => {
        if(err) {
            res.send(err);
        } else {
            res.send({
                errcode: 0
            });
        }
    })
})

module.exports = router;